// this is live preview
import {
    Button as EmailButton,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Img,
    Row,
    Column,
    Heading,
    Body,
    Tailwind,
  } from "@react-email/components"
  
  interface EmailPreviewProps {
    components: any[]
    isInline?: boolean
  }
  
  export function EmailPreview({ components, isInline = false }: EmailPreviewProps) {
    const content = (
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            {components.map((component) => renderEmailComponent(component))}
          </Container>
        </Body>
      </Tailwind>
    )
  
    if (isInline) {
      return content
    }
  
    return (
      <Html>
        <Head />
        <Preview>Email Preview</Preview>
        {content}
      </Html>
    )
  }
  
  function renderEmailComponent(component: any) {
    switch (component.type) {
      case "button":
        return (
          <Section key={component.id} style={{ textAlign: component.props.style?.textAlign }}>
            <EmailButton
              href={component.props.href || "#"}
              style={{
                ...component.props.style,
                display: "inline-block",
                padding: "12px 20px",
                borderRadius: "6px",
              }}
            >
              {component.content}
            </EmailButton>
          </Section>
        )
      case "text":
        return (
          <Text
            key={component.id}
            style={{
              ...component.props.style,
              margin: "10px 0",
            }}
          >
            {component.content}
          </Text>
        )
      case "image":
        return (
          <Section key={component.id} style={{ textAlign: component.props.style?.textAlign }}>
            <Img src={component.content || "https://jlug.club/assets/JLUG-b26f7b6c.jpg"} alt={component.props.alt || "alt"} width="100%" style={{ maxWidth: "100%" }} />
          </Section>
        )
      case "divider":
        return (
          <Section key={component.id} style={{ textAlign: component.props.style?.textAlign }}>
            {component.content && <Text style={{ color: component.props.style?.borderColor }}>{component.content}</Text>}
            <Hr
              style={{
                borderColor: component.props.style?.borderColor || "#000000",
                margin: "10px 0",
              }}
            />
          </Section>
        )
      case "container":
        return (
          <Section
            key={component.id}
            style={{
              ...component.props.style,
              padding: "20px",
              margin: "10px 0",
            }}
          >
            <Text>{component.content}</Text>
          </Section>
        )
      case "header":
        if (component.props.logo) {
          return (
            <Section
              key={component.id}
              style={{
                ...component.props.style,
                margin: "0 0 24px",
                textAlign: "center",
              }}
            >
              <Img src={component.props.logo} alt="Logo" width="120" height="40" style={{ marginBottom: "16px" }} />
              <Text style={{ fontSize: "24px", margin: 0 }}>{component.content}</Text>
            </Section>
          )
        }
        return (
          <Section
            key={component.id}
            style={{
              ...component.props.style,
              margin: "0 0 24px",
            }}
          >
            <Text>{component.content}</Text>
          </Section>
        )
      case "footer":
        if (component.props.type === "social") {
          return (
            <Section
              key={component.id}
              style={{
                ...component.props.style,
                textAlign: "center",
              }}
            >
              <Row style={{ marginBottom: "16px" }}>
                <Column align="center">
                  {component.props.twitter && (
                    <Link
                      href={component.props.twitter}
                      style={{ color: "#000000", textDecoration: "none", margin: "0 8px" }}
                    >
                      Twitter
                    </Link>
                  )}
                  {component.props.linkedin && (
                    <Link
                      href={component.props.linkedin}
                      style={{ color: "#000000", textDecoration: "none", margin: "0 8px" }}
                    >
                      LinkedIn
                    </Link>
                  )}
                  {component.props.github && (
                    <Link
                      href={component.props.github}
                      style={{ color: "#000000", textDecoration: "none", margin: "0 8px" }}
                    >
                      GitHub
                    </Link>
                  )}
                </Column>
              </Row>
              <Text style={{ margin: 0, color: "#666666" }}>{component.content}</Text>
            </Section>
          )
        }
        return (
          <Section
            key={component.id}
            style={{
              ...component.props.style,
              margin: "24px 0 0",
            }}
          >
            <Text>{component.content}</Text>
          </Section>
        )
      case "headerBanner":
        return (
          <Section key={component.id} style={{ margin: "0 0 24px" }}>
            <Img src={component.content || "https://jlug.club/assets/JLUG-b26f7b6c.jpg"} alt={component.props.alt || "alt"} width="100%" style={{ maxWidth: "100%" }} />
          </Section>
        )
      case "link":
        return (
          <Link key={component.id} href={component.props.href || "#"} style={{ color: "#067df7" }}>
            {component.content}
          </Link>
        )
      default:
        return null
    }
  }
  
export function renderEmailContainer(components: any[]) {
    return (
      <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-full">
        {components.map((component) => renderEmailComponent(component))}
      </Container>
    );
  }