import {
  CreateIngredientDto,
  EquipmentDto,
  equipmentsControllerCreate,
  equipmentsControllerFindAll,
  equipmentsControllerRemove,
  equipmentsControllerUpdate,
  EquipmentsControllerUpdateResponse,
  filesControllerUpload,
  FilesControllerUploadResponse,
  UpdateEquipmentDto,
} from "@/client";
import { useLoadingBar } from "@/layouts";
import { useEffect, useState } from "react";

const UseEquipment = (currentPage: number, searchTerm: string) => {
  const [equipments, setEquipments] = useState<EquipmentDto[]>();
  const [equipment, setEquipment] = useState<EquipmentDto>();
  const [totalPage, setTotalPage] = useState<number>(0);
  const { startLoading, completeLoading, setProgress } = useLoadingBar();

  useEffect(() => {
    getAllEquipment(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const getAllEquipment = async (currentPage: number, searchTerm: string) => {
    startLoading();
    try {
      const response = await equipmentsControllerFindAll({
        perPage: 7,
        page: currentPage,
        q: searchTerm,
      });
      setEquipments(response.data);
      if (response.meta?.total_pages) {
        setTotalPage(response.meta.total_pages);
      }
      completeLoading();
    } catch (error) {
      console.log(error);
      setProgress(0);
    }
  };
  const upFileImg = async (img: File) => {
    const imgUrl: FilesControllerUploadResponse = await filesControllerUpload({
      formData: { file: img },
    });
    return imgUrl.data?.url;
  };
  const createEquipment = async (equipment: CreateIngredientDto) => {
    startLoading();
    try {
      const response = await equipmentsControllerCreate({
        requestBody: equipment,
      });
      completeLoading();
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
      setProgress(0);
    }
  };
  const removeEquipment = async (id: string) => {
    startLoading();
    try {
      const response = await equipmentsControllerRemove({ id });
      console.log( response);
      completeLoading();
    } catch (e) {
      console.log(e);
      setProgress(0);
    }
  };
  const updateEquipment = async (equipment: UpdateEquipmentDto, id: string) => {
    startLoading();

    try {
      const response: EquipmentsControllerUpdateResponse =
        await equipmentsControllerUpdate({
          id,
          requestBody: equipment,
        });
      setEquipment(response.data);
      completeLoading();
    } catch (e) {
      setProgress(0);
      console.log(e);
    }
  };

  return {
    equipments,
    totalPage,
    equipment,
    getAllEquipment,
    updateEquipment,
    upFileImg,
    createEquipment,
    removeEquipment,
  };
};

export default UseEquipment;
