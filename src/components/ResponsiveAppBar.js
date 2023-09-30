import React, { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Avatar, Button, Tooltip, MenuItem, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { MenuBook } from "@mui/icons-material";

// https://mui.com/material-ui/react-app-bar/

const pages = [
     { name: 'Replacing books', url: '/replacingbooks' },
     // Add other pages with their respective URLs
     { name: 'Leaderboard', url: '/leaderboard' },
];

const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
     const [anchorElNav, setAnchorElNav] = useState(null);
     const [anchorElUser, setAnchorElUser] = useState(null);
     const navigate = useNavigate();

     const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
     const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

     const handleCloseNavMenu = () => setAnchorElNav(null);
     const handleCloseUserMenu = () => setAnchorElUser(null);

     const handleNavigation = (url) => {
          navigate(url);
          handleCloseNavMenu();
     };

     return (
          <AppBar position="static">
               <Container maxWidth="xl">
                    <Toolbar disableGutters>
                         <MenuBook sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
                         <Typography
                              variant="h6"
                              noWrap
                              component="a"
                              href="/dashboard"
                              sx={{
                                   mr: 2,
                                   display: { xs: "none", md: "flex" },
                                   fontFamily: "monospace",
                                   fontWeight: 700,
                                   letterSpacing: ".3rem",
                                   color: "inherit",
                                   textDecoration: "none",
                              }}
                         >
                              Novel Nest Library
                         </Typography>

                         <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                              <IconButton
                                   size="large"
                                   aria-label="account of current user"
                                   aria-controls="menu-appbar"
                                   aria-haspopup="true"
                                   onClick={handleOpenNavMenu}
                                   color="inherit"
                              >
                                   <MenuIcon />
                              </IconButton>
                              <Menu
                                   id="menu-appbar"
                                   anchorEl={anchorElNav}
                                   anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                   }}
                                   keepMounted
                                   transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                   }}
                                   open={Boolean(anchorElNav)}
                                   onClose={handleCloseNavMenu}
                                   sx={{
                                        display: { xs: "block", md: "none" },
                                   }}
                              >
                                   {pages.map((page) => (
                                        <MenuItem key={page.name} onClick={() => handleNavigation(page.url)}>
                                             <Typography textAlign="center">{page.name}</Typography>
                                        </MenuItem>
                                   ))}
                              </Menu>
                         </Box>

                         <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
                         <Typography
                              variant="h5"
                              noWrap
                              component="a"
                              href="/dashboard"
                              sx={{
                                   mr: 2,
                                   display: { xs: "flex", md: "none" },
                                   flexGrow: 1,
                                   fontFamily: "monospace",
                                   fontWeight: 700,
                                   letterSpacing: ".3rem",
                                   color: "inherit",
                                   textDecoration: "none",
                              }}
                         >
                              Novel Nest Library
                         </Typography>
                         <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                              {pages.map((page) => (
                                   <Button
                                        key={page.name}
                                        onClick={() => handleNavigation(page.url)}
                                        sx={{ my: 2, color: "white", display: "block" }}
                                   >
                                        {page.name}
                                   </Button>
                              ))}
                         </Box>

                         <Box sx={{ flexGrow: 0 }}>
                              <Tooltip title="Open settings">
                                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                                   </IconButton>
                              </Tooltip>
                              <Menu
                                   sx={{ mt: "45px" }}
                                   id="menu-appbar"
                                   anchorEl={anchorElUser}
                                   anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                   }}
                                   keepMounted
                                   transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                   }}
                                   open={Boolean(anchorElUser)}
                                   onClose={handleCloseUserMenu}
                              >
                                   {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                             <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                   ))}
                              </Menu>
                         </Box>
                    </Toolbar>
               </Container>
          </AppBar>
     );
}

export default ResponsiveAppBar;
