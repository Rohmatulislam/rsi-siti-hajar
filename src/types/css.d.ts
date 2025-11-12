// Deklarasi tipe untuk file CSS modules
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Deklarasi tipe untuk file CSS global
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// Deklarasi tipe untuk file CSS modules dengan module.scss
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Deklarasi tipe untuk file gambar dan aset
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.ico' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}