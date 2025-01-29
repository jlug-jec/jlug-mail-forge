export const emailTemplates = {
    buttons: [
      {
        name: "Primary Button",
        template: {
          content: "Get Started",
          props: {
            href: "#",
            style: {
              background: "#000",
              padding: "12px 24px",
              borderRadius: "6px",
              color: "#fff",
              display: "inline-block",
              textAlign: "center",
            },
          },
        },
      },
      {
        name: "Outline Button",
        template: {
          content: "Learn More",
          props: {
            href: "#",
            style: {
              border: "1px solid #000",
              padding: "12px 24px",
              borderRadius: "6px",
              color: "#000",
              display: "inline-block",
              textAlign: "center",
            },
          },
        },
      },
    ],
    footers: [
      {
        name: "Simple Footer",
        template: {
          content: "© 2024 Your Company. All rights reserved.",
          props: {
            style: {
              backgroundColor: "#f3f4f6",
              padding: "24px",
              textAlign: "center",
            },
          },
        },
      },
      {
        name: "Social Footer",
        template: {
          content: "© 2024 Your Company. All rights reserved.",
          props: {
            type: "social",
            twitter: "#",
            linkedin: "#",
            github: "#",
            style: {
              backgroundColor: "#f3f4f6",
              padding: "32px",
            },
          },
        },
      },
    ],
    headers: [
      {
        name: "Simple Header",
        template: {
          content: "Welcome to Our Newsletter",
          props: {
            style: {
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "32px 0",
            },
          },
        },
      },
      {
        name: "Logo Header",
        template: {
          content: "Welcome to Our Newsletter",
          props: {
            logo: "https://sjc.microlink.io/D8p3VYhjDG6wO_-HozRb_lsk4gAm6X_rK46VMbyhEx5g9bH4BgGJsxyr2N8-XMTVWv53J4cpZYTkqFGVNxxZ9w.jpeg",
            style: {
              padding: "32px 0",
              backgroundColor: "#f8f9fa",
            },
          },
        },
      },
    ],
  }
  
  