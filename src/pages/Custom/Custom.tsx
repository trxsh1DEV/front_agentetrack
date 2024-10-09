import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import requestWithToken from "@/utils/request";
import { useToast } from "@/components/ui/use-toast";

const AddItemPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectChange = (value: string) => {
    setSelectedField(value);
  };

  const handleAddClick = async () => {
    if (!inputValue || !selectedField) return;

    try {
      await requestWithToken.post("/company/custom", {
        customType: selectedField,
        value: [inputValue],
      });
      // console.log("Item adicionado com sucesso:", response.data);
      setInputValue(""); // Limpa o input após o envio
      setSelectedField(""); // Limpa o select após o envio
      toast({
        title: "Sucesso",
        className: "bg-success border-zinc-100",
        variant: "destructive",
        description: `Item '${inputValue}' adicionado com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        // className: "bg-success border-zinc-100",
        variant: "destructive",
        description: `Ocorreu um problema para adicionar esse item. Erro ${error.message}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Adicionar Customização
        </h1>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite o valor que quer adicionar"
          className="mb-4 text-lg"
        />
        <div className="">
          {/* <Label
            htmlFor="department_ref"
            className="text-2xl font-medium text-gray-700 dark:text-gray-300 "
          >
            Departamento
          </Label> */}

          <Select onValueChange={handleSelectChange}>
            <SelectTrigger
              id="choice"
              className="w-full dark:bg-slate-800 px-3 py-2 text-lg ring-ring focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2"
            >
              <SelectValue
                id="department"
                data-select-type="edit-field"
                placeholder="Selecione uma das opções"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Escolha sua customização</SelectLabel>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="department">Departamento</SelectItem>
                <SelectItem value="collaborator">Colaborador</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleAddClick}
          className="w-full  text-white hover:bg-indigo-500 mt-10 text-xl"
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default AddItemPage;
