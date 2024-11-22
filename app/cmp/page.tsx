import {  Autocomplete,  AutocompleteSection,  AutocompleteItem} from "@nextui-org/autocomplete";
import React from "react";
import geo from "@/components/geo.json";
export default function App() {
  const [value, setValue] = React.useState('');
  const [selectedKey, setSelectedKey] = React.useState(null);

  const onSelectionChange = (id) => {
    setSelectedKey(id);
  };
  
  const onInputChange = (value) => {
    setValue(value)
  };

  return (
    <div className="flex w-full flex-col">
      <Autocomplete 
        label="Search an animal" 
        variant="bordered"
        defaultItems={animals}
        className="max-w-xs" 
        allowsCustomValue={true}
        onSelectionChange={onSelectionChange}
        onInputChange={onInputChange}
      >
        {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
      </Autocomplete>
      <p className="mt-1 text-small text-default-500">Current selected animal: {selectedKey}</p>
      <p className="text-small text-default-500">Current input text: {value}</p>
    </div>
  );
}