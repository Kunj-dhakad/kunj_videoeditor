export const themeSetCSSVariables = async (data: { id: string; action: string;  project_id:string }) => {
  // console.log("Request received:", data);

  if (data.action === 'sendProjectInfo') {
    try {
      const response = await fetch(`/project/${data.project_id}.json`);
      const theme = await response.json();

      // console.log("theme", theme)

      // Set CSS variables
      document.documentElement.style.setProperty('--kd-theme-primary', theme.themePrimary);
      document.documentElement.style.setProperty('--kd-primary-btn-bg', theme.primaryBtnBg);
      document.documentElement.style.setProperty(' --kd-primary-btn-bg-hover', theme.primaryBtnBgHover);

      // document.documentElement.style.setProperty('--kd-theme-sub-bg', theme.themeSubBg);

    } catch (error) {
      console.error("Error fetching or applying theme:", error);
    }
  }
};
