export type Theme = {
  white: string;
  black: string;
  authorBackground: string;
  textColorReview: string;
  Background: string;
  starColor: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  quaternaryText: string;
  quinaryText: string 
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
  secondaryTransparent: string;
  primaryTransparent: string;
  iconColorSecondary: string;
  spoilerOverlay: string;
  postCardBackground: string;
  spoilerText: string;
};


export const themes: Record<'light' | 'dark', Theme> = {
  light: {
    white: '#FFFFFF',
    black: '#FFFFFF',
    authorBackground: '#rgba(156, 15, 83, 0.07)',
    textColorReview: '#808080',
    Background: "#FFFFFF",
    starColor: "#F4D06F",
    primaryText: "#000000",
    secondaryText:"#474545",
    tertiaryText:"#9D0F54",
    quaternaryText: '#FFFFFF',
    quinaryText: '#000000',
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
    iconColorSecondary: "#064A4A",
    secondaryTransparent: "#064A4A80",
    primaryTransparent: "#9D0F5480",
    spoilerOverlay: "#000000E6",
    postCardBackground:"#ECECEC",
    spoilerText: "#FFFFFF",
  },
  dark: {
    white: '#FFFFFF',
    black: '#FFFFFF',
    authorBackground: '#rgba(255, 255, 255, 0.07)',
    textColorReview: '#D3D3D3',
    Background: "#0F0F0F",
    starColor: "#F4D06F",
    primaryText: "#FFFFFF",
    secondaryText: "#B3B3B3",
    tertiaryText: "#9D0F54",
    quaternaryText: '#000000', //preto
    quinaryText: '#FFFFFF', //branco
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
    iconColor: "#9D0F54",
    iconColorSecondary: "#064A4A",
    secondaryTransparent: "#064A4A80",
    primaryTransparent: "#9D0F5480",
    spoilerOverlay: "#5C5757DE",
    postCardBackground:"#2F2B2B",
    spoilerText: "#FFFFFF"
  }
  
};
