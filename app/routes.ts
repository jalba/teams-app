import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('teams/:teamId', 'routes/team.tsx'),
] satisfies RouteConfig;
