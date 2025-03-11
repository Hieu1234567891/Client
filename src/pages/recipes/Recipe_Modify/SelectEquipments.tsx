import { EquipmentDto } from "@/client";
import useEquipment from "@/hooks/useEquipment.tsx";
import EquipmentModal from "@/pages/recipes/equipmentModal/EquipmentModal.tsx";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDebounce } from "use-debounce";

interface SelectEquipmentsProps {
  setRecipeEquipmentList: React.Dispatch<React.SetStateAction<string[]>>;
  equipmentList?: Array<EquipmentDto>;
}

const SelectEquipments: React.FC<SelectEquipmentsProps> = ({
  setRecipeEquipmentList,
  equipmentList,
}) => {
  const [searchEquipment, setSearchEquipment] = useState<string>("");
  const [debouncedSearchEquipment] = useDebounce(searchEquipment, 300); // Debounce for 300ms
  const { equipments, createEquipment, updateEquipment } = useEquipment(
    1,
    debouncedSearchEquipment,
  );
  const [selectedEquipments, setSelectedEquipments] = useState<EquipmentDto[]>(
    equipmentList || [],
  );
  const [selected, setSelected] = useState<EquipmentDto | null>(null);
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentDto | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (equipmentList) {
      setSelectedEquipments(equipmentList);
      setRecipeEquipmentList(equipmentList.map((item) => item.id));
    }
  }, [equipmentList, setRecipeEquipmentList]);

  const handleAddEquipment = (equipment?: EquipmentDto) => {
    const equipmentToAdd = equipment || selected;
    if (
      equipmentToAdd &&
      !selectedEquipments.some((item) => item.id === equipmentToAdd.id)
    ) {
      setSelectedEquipments((prev) => [...prev, equipmentToAdd]);
      setRecipeEquipmentList((prev) => [...prev, equipmentToAdd.id]);
      setSelected(null);
      setSearchEquipment(""); // Clear the search input after adding
    }
  };
  const openModal = (equipment: EquipmentDto | null) => {
    setSelectedEquipment(equipment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEquipment(null);
    setModalOpen(false);
  };
  const handleRemoveEquipment = (id: string) => {
    setSelectedEquipments((prev) => prev.filter((equip) => equip.id !== id));
    setRecipeEquipmentList((prev) => prev.filter((equipId) => equipId !== id));
  };

  useEffect(() => {
    handleAddEquipment();
  }, [selected]);
  const handleUpdate = async (id: string, img: string, name: string) => {
    try {
      await updateEquipment({ name: name, image: img }, id);

      closeModal();
    } catch (error) {
      console.error("Error updating equipment:", error);
    }
  };

  const handleCreate = async (img: string, name: string) => {
    try {
      const repo = await createEquipment({ name, image: img });
      handleAddEquipment(repo);
      closeModal();
    } catch (error) {
      console.error("Error creating equipment:", error);
    }
  };
  const options =
    equipments?.map((equipment) => ({
      value: equipment.id,
      label: equipment.name,
    })) || [];

  return (
    <>
      <div className="space-y-4 border p-4 bg-white rounded mt-8">
        <h3 className="text-lg font-semibold">Công cụ nấu ăn</h3>
        <div className="flex items-center space-x-4">
          <Select
            value={
              selected ? { value: selected.id, label: selected.name } : null
            }
            onChange={(option) => {
              const selectedId = option ? option.value : null;
              const selectedEquipment =
                equipments?.find((equipment) => equipment.id === selectedId) ??
                null;
              setSelected(selectedEquipment);
            }}
            options={options}
            isClearable
            isSearchable
            placeholder="Chọn thiết bị"
            onInputChange={(inputValue) => setSearchEquipment(inputValue)}
            className="w-1/2"
          />
          <button
            className="btn btn-outline btn-info"
            onClick={() => openModal(null)}
          >
            <IconPlus /> Tạo mới Dụng Cụ Nấu Ăn
          </button>
        </div>

        <h4 className="font-medium">Danh sách thiết bị đã chọn:</h4>
        <ul className="space-y-2">
          {selectedEquipments.map((equip) => (
            <li key={equip.id} className="flex items-center  ">
              <span className="w-3/12 text-center input input-bordered input-sm">
                {" "}
                {equip.name}
              </span>
              <button
                className="btn btn-outline btn-error btn-sm ml-4"
                onClick={() => handleRemoveEquipment(equip.id)}
              >
                <IconTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <EquipmentModal
        isOpen={isModalOpen}
        equipment={selectedEquipment}
        onClose={closeModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
      />
    </>
  );
};

export default SelectEquipments;
