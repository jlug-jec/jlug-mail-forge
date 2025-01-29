

import { 
  LinearLoginCode,
  PlaidVerifyIdentity,
  RaycastMagicLink,
  SlackConfirm,
  CodepenChallengers,
  GithubAccessToken,
  PapermarkYearInReview,
  VercelInviteUser,
  YelpRecentLogin,
  DropboxResetPassword,
  TwitchResetPassword,
  AirbnbReview,
  AmazonReview,
  KoalaWelcome,
  StripeWelcome,
} from '@/templates/all'

export const templateComponents = {
  'linear-login-code': LinearLoginCode,
  'plaid-verify-identity': PlaidVerifyIdentity,
  'raycast-magic-link': RaycastMagicLink,
  'slack-confirm': SlackConfirm,
  'codepen-challengers': CodepenChallengers,
  'github-access-token': GithubAccessToken,
  'papermark-year-in-review': PapermarkYearInReview,
  'vercel-invite-user': VercelInviteUser,
  'yelp-recent-login': YelpRecentLogin,
  'dropbox-reset-password': DropboxResetPassword,
  'twitch-reset-password': TwitchResetPassword,
  'airbnb-review': AirbnbReview,
  'amazon-review': AmazonReview,
  'koala-welcome': KoalaWelcome,
  'stripe-welcome': StripeWelcome,
}

export * from './all'
