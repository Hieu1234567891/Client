const IngredientCard = ({
  name,
  image,
  onClick,
}: {
  name: string;
  image: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="relative w-56 h-24 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-100"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover brightness-75"
      />
      <div className="absolute bottom-0 left-0 bg-opacity-50 text-white p-2">
        {name}
      </div>
    </div>
  );
};

export default IngredientCard;
