import { RecipeStepDto } from "@/client";
import { useRecipes } from "@/hooks";
import { convertSecondsToHoursMinutesSeconds } from "@/utils";
import {
  IconClockHour4,
  IconPhoto,
  IconPhotoOff,
  IconPhotoPlus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface StepProps {
  setStep: (steps: Array<RecipeStepDto>) => void; // Cập nhật danh sách steps
  stepList?: Array<RecipeStepDto>;
}

const StepModal: React.FC<StepProps> = ({ setStep, stepList }) => {
  const [list, setList] = useState<RecipeStepDto[]>([]);
  const { upFileImg } = useRecipes();
  useEffect(() => {
    if (stepList && stepList.length > 0) {
      setList(stepList);
    } else {
      setList([
        {
          step: "",
          images: [""],
          time: 0,
        },
      ]);
    }
  }, [stepList]);

  const handleStepChange = (
    index: number,
    field: string,
    value: string | number,
    imageIndex?: number,
  ) => {
    const updatedSteps = [...list];

    if (field === "step") {
      updatedSteps[index].step = value as string;
    } else if (field === "time") {
      updatedSteps[index].time = (value as number) * 60;
    } else if (field === "image") {
      if (typeof imageIndex === "number") {
        updatedSteps[index].images[imageIndex] = value as string;
      }
    }

    setList(updatedSteps);
    setStep(updatedSteps);
  };

  const handleAddImage = (index: number) => {
    const updatedSteps = [...list];
    updatedSteps[index].images.push("");
    setList(updatedSteps);
  };

  const handleRemoveImage = (stepIndex: number, imageIndex: number) => {
    const updatedSteps = [...list];
    updatedSteps[stepIndex].images.splice(imageIndex, 1);
    setList(updatedSteps);
    setStep(updatedSteps);
  };

  const handleAddStep = () => {
    const newStep: RecipeStepDto = {
      step: "",
      time: 0,
      images: [],
    };
    setList([...list, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    const updatedSteps = [...list];
    updatedSteps.splice(index, 1);
    setList(updatedSteps);
    setStep(updatedSteps);
  };

  const renderSteps = () => {
    if (!list || list.length === 0) {
      return <p>Diễn tả quy trình làm món ăn bằng nút bên dưới</p>;
    }

    return list.map((step, index) => (
      <div key={index} className="mb-4 border p-4 bg-white rounded">
        <h3 className={"font-semibold"}>{`Bước ${index + 1}`}</h3>
        <p>
          Thời gian {`bước ${index + 1}`}:{" "}
          <span className="font-bold">
            {convertSecondsToHoursMinutesSeconds(step.time)}
          </span>
        </p>
        <textarea
          className="textarea textarea-accent w-11/12 max-w-5xl mb-2"
          placeholder="Giải thích từng bước"
          value={step.step}
          onChange={(event) =>
            handleStepChange(index, "step", event.target.value)
          }
        />

        <label className="input input-bordered flex items-center w-1/3 gap-2">
          <input
            type="number"
            className="w-5/12 max-w-xs mr-2 grow no-spinners [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Thời gian"
            value={step.time / 60}
            onChange={(event) =>
              handleStepChange(index, "time", Number(event.target.value))
            }
          />
          <kbd className="kbd kbd-sm">Phút</kbd>
          <IconClockHour4 />
        </label>

        {step.images.map((image, imgIndex) => (
          <div key={imgIndex} className="flex items-center mb-2 mt-4">
            <label className="input input-bordered flex items-center w-9/12 max-w-5xl mb-1 mr-2 gap-2">
              <input
                type="text"
                className="drawer"
                placeholder={`Đường dẫn Ảnh ${imgIndex + 1}`}
                value={image}
                onChange={(event) =>
                  handleStepChange(index, "image", event.target.value, imgIndex)
                }
              />
              <IconPhoto
                className="cursor-pointer"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = async (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                      const imageUrl = await upFileImg(file);
                      if (imageUrl) {
                        handleStepChange(index, "image", imageUrl, imgIndex);
                      }
                    }
                  };
                  input.click();
                }}
              />
            </label>

            <button
              onClick={() => handleRemoveImage(index, imgIndex)}
              className="btn btn-error btn-sm"
            >
              <IconPhotoOff /> Xóa ảnh
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddImage(index)}
          className="btn btn-info mb-2 mt-4"
        >
          <IconPhotoPlus /> Thêm Ảnh
        </button>

        <div className="text-xs text-gray-500 mt-1">
          Bấm vào biểu tượng ảnh để tải lên
          <IconPhoto />
        </div>

        {/* Hiển thị tất cả hình ảnh của bước */}
        <div className="mt-4">
          <h4>Hình ảnh đã thêm:</h4>
          <PhotoProvider>
            <div className="flex flex-wrap">
              {step.images.map((image, imgIndex) => (
                <PhotoView key={imgIndex} src={image}>
                  <img
                    src={image}
                    alt={`Image ${imgIndex + 1} for step ${index + 1}`}
                    className="w-20 h-20 object-cover mr-2 mb-2 rounded cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://static.naucomnha.com/images/e8274e03-5838-458b-bb61-b1e60ebd3c53.png"; // URL hình ảnh dự phòng
                    }}
                  />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        </div>

        <button
          onClick={() => handleRemoveStep(index)}
          className="btn btn-error mb-4 mt-4"
        >
          <IconTrash /> Loại bỏ {`bước ${index + 1}`}
        </button>
      </div>
    ));
  };

  return (
    <div className={"border p-4 bg-white rounded mt-8"}>
      <h3 className="text-lg font-semibold">Quá trình tạo nên món ăn</h3>
      {renderSteps()}
      <button onClick={handleAddStep} className="btn btn-primary mt-4">
        <IconPlus /> Thêm bước hướng dẫn
      </button>
    </div>
  );
};

export default StepModal;
