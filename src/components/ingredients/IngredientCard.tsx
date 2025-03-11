import { BaseComponent } from "@/components/common";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
const IngredientCard = ({
  className,
  image,
  name,
}: {
  className?: string;
  id?: string;
  image?: string;
  name?: string;
}) => {
  return (
    <BaseComponent
      className={`card card-compact bg-base-100 w-60 shadow-xl cursor-pointer hover:shadow-2xl ${className}`}
    >
      <PhotoProvider>
        <PhotoView src={image}>
          <a href="#" className="font-medium hover:underline">
            <img
              src={image}
              alt={name}
              className="rounded-xl object-cover w-full h-40"
            />
          </a>
        </PhotoView>
      </PhotoProvider>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p></p>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm">
            <p>❤️</p>
            {Math.floor(Math.random() * 50)}
          </button>
          <button className="btn btn-sm">
            <p>😋</p>
            {Math.floor(Math.random() * 50)}
          </button>
        </div>
      </div>
    </BaseComponent>
  );
};

export default IngredientCard;
