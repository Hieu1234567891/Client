import { UserDto } from "@/client";
import { BaseComponent } from "@/components/common";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({
  className,
  id,
  image,
  name,
  descriptions,
  author,
}: {
  className?: string;
  id?: string;
  image?: string;
  name?: string;
  descriptions?: string;
  author?: UserDto;
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipeDetails/${id}`);
  };

  return (
    <BaseComponent
      onClick={handleCardClick}
      className={`card card-compact bg-base-100 w-56 shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-100 ${className}`}
    >
      <figure className="">
        <img
          src={image}
          alt={name}
          className="rounded-t-xl object-cover w-full h-40"
        />
      </figure>
      <div className="card-body">
        <div className="avatar flex items-center">
          <div className="w-6 rounded-full">
            <img src={author?.avatar || "https://www.bodyandsoulhealthclub.com/wp-content/uploads/2019/01/null-user.jpg"} />
          </div>
          <p className="ml-2 text-md font-bold">{author?.full_name}</p>
        </div>
        <h2 className="card-title">{name}</h2>
        <p className="text-bold">{descriptions}</p>
        {/* <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm">
            <p>❤️</p>
            {Math.floor(Math.random() * 50)}
          </button>
          <button className="btn btn-sm">
            <p>😋</p>
            {Math.floor(Math.random() * 50)}
          </button>
        </div> */}
      </div>
    </BaseComponent>
  );
};

export default RecipeCard;
