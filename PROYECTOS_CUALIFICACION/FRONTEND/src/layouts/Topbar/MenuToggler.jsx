/*

 * File Name: MenuToggler.tsxAuthor: Miguel Ángel Noel García*/

import { IconButton } from "@mui/material";
import { useLayoutContext } from "../../states";
import { LuMenu } from "react-icons/lu";
const MenuToggler = () => {
  const {
    settings,
    updateSidenav
  } = useLayoutContext();
  const showSideNavMobile = () => {
    updateSidenav({
      showMobileMenu: !settings.sidenav.showMobileMenu
    });
  };
  return <IconButton color={"inherit"} onClick={showSideNavMobile}>
      <LuMenu />
    </IconButton>;
};
export default MenuToggler;