export type Theme = {
  Background: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  primary:string;
  secondary:string;
  tertiary:string;
  quaternary: string;
  highlight:string;
  successColor: string;
  errorColor: string;
  warningColor: string;
  dividerColor: string;   
  borders: string; 
  placeholder: string;
  iconColor: string;
};


export const themes: Record<'light' | 'dark', Theme> = {
  light: {
    Background: "#FFFFFF",
    primaryText: "#000000",
    secondaryText:"#474545",
    tertiaryText:"#9D0F54",
    primary:"#9D0F54",
    secondary:"#064A4A",
    tertiary:"#FF8811",
    quaternary: "#F5E2C8",
    highlight: "#FFD700",          
    successColor: "#2E8B57",       
    errorColor: "#D0342C",         
    warningColor: "#FFA500",       
    dividerColor: "#E0E0E0",       
    borders: "#CCCCCC",            
    placeholder: "#A9A9A9",        
    iconColor: "#9D0F54",          

  },
  dark: {
    Background: "#0F0F0F",
    primaryText: "#FFFFFF",
    secondaryText: "#B3B3B3",
    tertiaryText: "#9D0F54",
    primary: "#9D0F54",
    secondary: "#064A4A",
    tertiary: "#FF8811",
    quaternary: "#F5E2C8",
    highlight: "#FFD700",
    successColor: "#2E8B57",
    errorColor: "#D0342C",
    warningColor: "#FFA500",
    dividerColor: "#2C2C2C",
    borders: "#3A3A3A",
    placeholder: "#888888",
    iconColor: "#9D0F54"
  }
  
};
