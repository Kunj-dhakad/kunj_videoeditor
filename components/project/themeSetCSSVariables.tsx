export const themeSetCSSVariables = async (data: { id: string; action: string;  project_id:string }) => {
  // console.log("Request received:", data);

  if (data.action === 'sendProjectInfo') {
    try {
      const response = await fetch(`/project/${data.project_id}.json`);
      const theme = await response.json();

      // console.log("theme", theme)

      // Set CSS variables
      document.documentElement.style.setProperty('--kd-button-background', theme.BgColor);
      document.documentElement.style.setProperty('--kd-heading-text-color', theme.headingTextColor);
      document.documentElement.style.setProperty('--kd-subheading-text-color', theme.subHeadingTextColor);
      document.documentElement.style.setProperty('--kd-background', theme.BgColor);
      document.documentElement.style.setProperty('--kd-button-border-color', theme.buttonBorderColor);
      document.documentElement.style.setProperty('--kd-button-text-color', theme.buttonTextColor);
      document.documentElement.style.setProperty('--kd-button-border-radius', theme.buttonBorderRadius);

      if (theme.buttonHoverStyles) {
        document.documentElement.style.setProperty('--kd-button-hover-background', theme.buttonHoverStyles.buttonBgColor);
        document.documentElement.style.setProperty('--kd-button-hover-border-color', theme.buttonHoverStyles.buttonBorderColor);
        document.documentElement.style.setProperty('--kd-button-hover-text-color', theme.buttonHoverStyles.buttonTextColor);
        document.documentElement.style.setProperty('--kd-button-hover-border-radius', theme.buttonHoverStyles.buttonBorderRadius);
      }

      // console.log("Theme applied:", theme);
    } catch (error) {
      console.error("Error fetching or applying theme:", error);
    }
  }
};
