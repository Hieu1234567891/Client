import {
  About,
  ErrorPage,
  Home,
  PrivacyPolicy,
  Profile,
  RecipeDetails,
  RecipesSearch,
  SearchIngredientsResult,
  UserProfile,
  UserRecipes,
} from "@/pages";
import { RecipeDrawer } from "@/pages/recipes";
import { UserFollowRecipes, UserSaveRecipes } from "@/pages/userRecipe";

const routesConfig = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/search/ingredients",
    element: <SearchIngredientsResult />,
  },
  {
    path: "/search/recipes",
    element: <RecipesSearch />,
  },
  {
    path: "/recipeDetails/:id",
    element: <RecipeDetails />,
  },
  {
    path: "/userDetails/:id",
    element: <UserProfile />,
    children: [
      {
        path: "recipes",
        element: <UserRecipes />,
      },
      {
        path: "saved",
        element: <UserSaveRecipes />,
      },
      {
        path: "follow",
        element: <UserFollowRecipes />,
      },
    ],
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/me",
    element: <Profile />,
  },
  {
    path: "/recipe/edit/:id?",
    element: <RecipeDrawer />,
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routesConfig;
