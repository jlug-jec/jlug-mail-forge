// templates/types.ts
export interface BaseEmailProps {
    preview?: boolean;
  }
  
  export interface LinearLoginCodeEmailProps extends BaseEmailProps {
    validationCode: string;
  }
  
  export interface PlaidVerifyIdentityEmailProps extends BaseEmailProps {
    validationCode: string;
  }
  
  export interface RaycastMagicLinkEmailProps extends BaseEmailProps {
    magicLink: string;
  }
  
  export interface SlackConfirmEmailProps extends BaseEmailProps {
    confirmUrl: string;
  }
  
  export interface CodepenChallengersEmailProps extends BaseEmailProps {
    challengeUrl: string;
  }
  
  export interface GithubAccessTokenEmailProps extends BaseEmailProps {
    token: string;
  }
  
  export interface PapermarkYearInReviewEmailProps extends BaseEmailProps {
    year: number;
    stats: any; // Add specific stats type
  }
  
  export interface VercelInviteUserEmailProps extends BaseEmailProps {
    inviteUrl: string;
  }
  
  export interface YelpRecentLoginEmailProps extends BaseEmailProps {
    loginLocation: string;
    loginTime: string;
  }
  
  export interface DropboxResetPasswordEmailProps extends BaseEmailProps {
    resetUrl: string;
  }
  
  export interface TwitchResetPasswordEmailProps extends BaseEmailProps {
    resetUrl: string;
  }
  
  export interface AirbnbReviewEmailProps extends BaseEmailProps {
    hostName: string;
    propertyName: string;
  }
  
  export interface AmazonReviewEmailProps extends BaseEmailProps {
    productName: string;
    orderDate: string;
  }
  
  export interface KoalaWelcomeEmailProps extends BaseEmailProps {
    userName: string;
  }
  
  export interface StripeWelcomeEmailProps extends BaseEmailProps {
    businessName: string;
  }
  
  // Template component type with PreviewProps
  export type TemplateComponent<T> = React.ComponentType<T> & {
    PreviewProps: T;
  };
  
  // Define preview props for each component
  export const previewProps = {
    'linear-login-code': {
      validationCode: '123456',
    },
    'plaid-verify-identity': {
      validationCode: '123456',
    },
    'raycast-magic-link': {
      magicLink: 'https://example.com/magic-link',
    },
    'slack-confirm': {
      confirmUrl: 'https://example.com/confirm',
    },
    'codepen-challengers': {
      challengeUrl: 'https://example.com/challenge',
    },
    'github-access-token': {
      token: 'ghp_123456789',
    },
    'papermark-year-in-review': {
      year: 2024,
      stats: {
        // Add sample stats
      },
    },
    'vercel-invite-user': {
      inviteUrl: 'https://example.com/invite',
    },
    'yelp-recent-login': {
      loginLocation: 'San Francisco, CA',
      loginTime: '2024-01-30 15:30 PST',
    },
    'dropbox-reset-password': {
      resetUrl: 'https://example.com/reset',
    },
    'twitch-reset-password': {
      resetUrl: 'https://example.com/reset',
    },
    'airbnb-review': {
      hostName: 'John Doe',
      propertyName: 'Cozy Downtown Apartment',
    },
    'amazon-review': {
      productName: 'Wireless Headphones',
      orderDate: '2024-01-15',
    },
    'koala-welcome': {
      userName: 'Alex',
    },
    'stripe-welcome': {
      businessName: 'Acme Inc',
    },
  } as const;
  
  // Type for all template components
  export type TemplateComponents = {
    [K in keyof typeof previewProps]: TemplateComponent<
      typeof previewProps[K] & BaseEmailProps
    >;
  };
  
  