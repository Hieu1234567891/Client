import { IngredientDto } from "@/client";
import UseRecipes from "@/hooks/useRecipes.tsx";
import { useEffect, useState } from "react";

interface IngredientModalProps {
  isOpen: boolean;
  ingredient: IngredientDto | null;
  onClose: () => void;
  onUpdate: (id: string, img: string, name: string) => Promise<void>;
  onCreate: (img: string, name: string) => Promise<void>;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  ingredient,
  onClose,
  onUpdate,
  onCreate,
}) => {
  const [name, setName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [inputMethod, setInputMethod] = useState<"file" | "url">("url");
  const [urlImg, setUrlImg] = useState<string>("");
  const { upFileImg } = UseRecipes();
  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setImagePreview(ingredient.image || "");
      setUrlImg(ingredient.image);
    } else if (ingredient == null) {
      setName("");
      setImagePreview("");
      setUrlImg("");
    }
  }, [ingredient]);
  const clear = () => {
    setName("");
    setImagePreview("");
    setUrlImg("");
  };
  const handleSave = () => {
    if (ingredient) {
      onUpdate(ingredient.id, urlImg, name).then(clear);
    } else {
      onCreate(urlImg, name).then(clear);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputMethod === "file" && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const uploadedUrl = await upFileImg(file);
      if (uploadedUrl) {
        setUrlImg(uploadedUrl);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Upload failed or URL is undefined");
      }
    } else if (inputMethod === "url") {
      const url = e.target.value;
      setUrlImg(url);
      setImagePreview(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="font-bold text-lg">
          {ingredient ? `Chỉnh sửa ${ingredient.name}` : "Tạo nguyên liệu mới"}
        </h2>

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Ingredient Preview"
              className="w-32 h-32 object-cover"
            />
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tên nguyên liệu</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Chọn phương thức nhập hình ảnh</span>
          </label>
          <select
            value={inputMethod}
            onChange={(e) => setInputMethod(e.target.value as "file" | "url")}
            className="select select-bordered"
          >
            <option value="url">Nhập URL</option>
            <option value="file">Tải lên từ máy</option>
          </select>

          {inputMethod === "url" ? (
            <div className="form-control mb-2">
              <label className="label">
                <span className="label-text">URL hình ảnh</span>
              </label>
              <input
                type="text"
                value={urlImg}
                onChange={handleImageChange}
                placeholder="Nhập URL hình ảnh"
                className="input input-bordered w-full mb-2"
              />
            </div>
          ) : (
            <div className="form-control mb-2">
              <label className="label">
                <span className="label-text">Hình ảnh</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full max-w-xs"
              />
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={handleSave}>
            {ingredient ? "Cập nhật" : "Tạo mới"}
          </button>
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
