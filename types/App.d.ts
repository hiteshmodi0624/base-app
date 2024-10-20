import { NavigationProp } from "@react-navigation/native";

type ScreenNames = [
  'index',
  'profile',
  'routes',
  '(tabs)',
  'blobs',
  'developer',
  'editblobs',
  'environment',
  'feedback',
  'json',
  'layersJson',
  'markers',
  'onboarding',
  'support',
  'tests',
  'yourdata',
  'subscription',
  'breadcrumbs',
  'appsettings',
];

type ScreenName = ScreenNames[number];

type RootStackParamList = Record<ScreenNames[number], any>;
type StackNavigation = NavigationProp<RootStackParamList>;
