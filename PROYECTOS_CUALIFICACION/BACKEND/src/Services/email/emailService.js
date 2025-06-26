const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { createTransporter, defaultSender } = require('./emailConfig');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = {};
  }

  /**
   * Inicializar el servicio de correo
   */
  async initialize() {
    try {
      this.transporter = createTransporter();
      await this.loadTemplates();
      console.log('Servicio de correo electrónico inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el servicio de correo:', error.message);
      throw error;
    }
  }

  /**
   * Cargar plantillas HTML
   */
  async loadTemplates() {
    const templatesPath = path.join(__dirname, 'templates');
    const templateFiles = [
      'incentivoAsignado.html',
      'reporteValidado.html',
      'reporteRechazado.html',
      'recordatorioReporte.html'
    ];

    for (const file of templateFiles) {
      try {
        const templatePath = path.join(templatesPath, file);
        const templateContent = await fs.readFile(templatePath, 'utf8');
        const templateName = file.replace('.html', '');
        this.templates[templateName] = handlebars.compile(templateContent);
      } catch (error) {
        console.error(`Error al cargar plantilla ${file}:`, error.message);
      }
    }
  }

  /**
   * Función base para enviar correos
   */
  async sendEmail(to, subject, templateName, data, attachments = []) {
    try {
      if (!this.transporter) {
        await this.initialize();
      }

      if (!this.templates[templateName]) {
        throw new Error(`Plantilla ${templateName} no encontrada`);
      }

      const htmlContent = this.templates[templateName](data);

      const mailOptions = {
        from: `${defaultSender.name} <${defaultSender.email}>`,
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`Correo enviado exitosamente a ${to}:`, result.messageId);
      return {
        success: true,
        messageId: result.messageId,
        recipient: to
      };

    } catch (error) {
      console.error(`Error al enviar correo a ${to}:`, error.message);
      return {
        success: false,
        error: error.message,
        recipient: to
      };
    }
  }

  /**
   * Notificar asignación de incentivo
   */
  async notifyIncentivoAsignado(datosIncentivo) {
    const {
      emailDocente,
      nombreDocente,
      nombreIncentivo,
      descripcionIncentivo,
      fechaInicio,
      fechaFin,
      observaciones,
      frecuenciaReporte,
      fechaPrimerReporte
    } = datosIncentivo;

    const subject = `Incentivo Asignado: ${nombreIncentivo}`;

    const templateData = {
      nombreDocente,
      nombreIncentivo,
      descripcionIncentivo,
      fechaInicio: this.formatDate(fechaInicio),
      fechaFin: this.formatDate(fechaFin),
      observaciones,
      frecuenciaReporte,
      fechaPrimerReporte: this.formatDate(fechaPrimerReporte)
    };

    return await this.sendEmail(
      emailDocente,
      subject,
      'incentivoAsignado',
      templateData
    );
  }

  /**
   * Notificar validación de reporte
   */
  async notifyReporteValidado(datosReporte) {
    const {
      emailDocente,
      nombreDocente,
      nombreIncentivo,
      fechaEntrega,
      observaciones,
      proximoReporte,
      frecuenciaReporte
    } = datosReporte;

    const subject = `Reporte Validado - ${nombreIncentivo}`;

    const templateData = {
      nombreDocente,
      nombreIncentivo,
      fechaEntrega: this.formatDate(fechaEntrega),
      fechaValidacion: this.formatDate(new Date()),
      observaciones,
      proximoReporte: proximoReporte ? this.formatDate(proximoReporte) : null,
      frecuenciaReporte
    };

    return await this.sendEmail(
      emailDocente,
      subject,
      'reporteValidado',
      templateData
    );
  }

  /**
   * Notificar rechazo de reporte
   */
  async notifyReporteRechazado(datosReporte) {
    const {
      emailDocente,
      nombreDocente,
      nombreIncentivo,
      fechaEntrega,
      observaciones,
      mensajeAdministrador,
      proximaFechaLimite
    } = datosReporte;

    const subject = `Reporte Rechazado - ${nombreIncentivo}`;

    const templateData = {
      nombreDocente,
      nombreIncentivo,
      fechaEntrega: this.formatDate(fechaEntrega),
      fechaValidacion: this.formatDate(new Date()),
      observaciones,
      mensajeAdministrador,
      proximaFechaLimite: proximaFechaLimite ? this.formatDate(proximaFechaLimite) : null
    };

    return await this.sendEmail(
      emailDocente,
      subject,
      'reporteRechazado',
      templateData
    );
  }

  /**
   * Notificar recordatorio de reporte pendiente
   */
  async notifyRecordatorioReporte(datosRecordatorio) {
    const {
      emailDocente,
      nombreDocente,
      nombreIncentivo,
      fechaLimite,
      diasAntes,
      numeroReporte,
      frecuenciaReporte
    } = datosRecordatorio;

    let subject;
    let priority = 'normal';
    
    switch (diasAntes) {
      case 30:
        subject = `📅 Recordatorio: Reporte de ${nombreIncentivo} vence en 30 días`;
        break;
      case 10:
        subject = `⏰ Recordatorio: Reporte de ${nombreIncentivo} vence en 10 días`;
        priority = 'high';
        break;
      case 1:
        subject = `🚨 URGENTE: Reporte de ${nombreIncentivo} vence mañana`;
        priority = 'high';
        break;
      default:
        subject = `Recordatorio: Reporte de ${nombreIncentivo} próximo a vencer`;
    }

    const templateData = {
      nombreDocente,
      nombreIncentivo,
      fechaLimite: this.formatDate(fechaLimite),
      diasAntes,
      numeroReporte,
      frecuenciaReporte,
      fechaActual: this.formatDate(new Date()),
      esUrgente: diasAntes === 1
    };

    return await this.sendEmail(
      emailDocente,
      subject,
      'recordatorioReporte',
      templateData,
      priority
    );
  }

  /**
   * Formatear fecha para mostrar en correos
   */
  formatDate(date) {
    if (!date) return null;
    
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Verificar configuración del servicio
   */
  async verifyConnection() {
    try {
      if (!this.transporter) {
        await this.initialize();
      }
      
      await this.transporter.verify();
      return { success: true, message: 'Conexión verificada correctamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Instancia singleton
const emailService = new EmailService();

module.exports = emailService; 