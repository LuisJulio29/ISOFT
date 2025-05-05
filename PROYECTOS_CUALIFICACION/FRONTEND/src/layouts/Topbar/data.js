import avatar2 from "../../assets/images/avatars/avatar2.png";
import avatar4 from "../../assets/images/avatars/avatar4.png";
import githubIcon from "../../assets/images/brands/github.png";
import bitbucketIcon from "../../assets/images/brands/bitbucket.png";
import dropboxIcon from "../../assets/images/brands/dropbox.png";
import slackIcon from "../../assets/images/brands/slack.png";
import dribbbleIcon from "../../assets/images/brands/dribbble.png";
import behanceIcon from "../../assets/images/brands/behance.png";
import { LuMessageSquare, LuMessagesSquare, LuUserPlus } from "react-icons/lu";
/**
 * Get the apps
 */
const apps = [{
  name: "GitHub",
  icon: githubIcon,
  redirectTo: ""
}, {
  name: "Bitbucket",
  icon: bitbucketIcon,
  redirectTo: ""
}, {
  name: "Dropbox",
  icon: dropboxIcon,
  redirectTo: ""
}, {
  name: "Slack",
  icon: slackIcon,
  redirectTo: ""
}, {
  name: "Dribbble",
  icon: dribbbleIcon,
  redirectTo: ""
}, {
  name: "Behance",
  icon: behanceIcon,
  redirectTo: ""
}];
const notifications = [{
  id: 1,
  text: "Datacorp",
  subText: "Caleb Flakelar commented on Admin",
  icon: LuMessageSquare,
  link: "/app/notificaciones/inbox",
  createdAt: subtractHours(new Date(), 1)
}, {
  id: 2,
  text: "Admin",
  subText: "New user registered",
  icon: LuUserPlus,
  createdAt: subtractHours(new Date(), 60)
}, {
  id: 3,
  text: "Cristina Pride",
  subText: "Hi, How are you? What about our next meeting",
  avatar: avatar2,
  createdAt: subtractHours(new Date(), 1440)
}, {
  id: 4,
  text: "Datacorp",
  subText: "Caleb Flakelar commented on Admin",
  icon: LuMessagesSquare,
  createdAt: subtractHours(new Date(), 2880)
}, {
  id: 5,
  text: "Karen Robinson",
  subText: "Wow ! this admin looks good and awesome design",
  avatar: avatar4,
  createdAt: subtractHours(new Date(), 2880)
}];

/**
 * for subtraction minutes
 */
function subtractHours(date, minutes) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}
export { notifications, apps };