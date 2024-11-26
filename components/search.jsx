"use client";
import React from "react";
import DataTableDemo from "@/components/ratetable";
import { Tabs, Tab, Button, Card, CardBody, } from "@nextui-org/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"



import { Image } from "@nextui-org/react";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import { Listbox, ListboxItem } from "@nextui-org/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function App() {

  const [value, setValue] = React.useState('');
  const [selectedLoKey, setSelectedLoKey] = React.useState(null);
  const [selectedNmKey, setNmSelectedKey] = React.useState(null);

  const [selected, setSelected] = React.useState("location");

  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  const onSelectionChange = (id) => {
    if (selected == 'location') {
      setSelectedLoKey(id);
    } else {
      setNmSelectedKey(id)
    }
  };

  const onInputChange = (value) => {
    if (selected == 'location') {
      locations.setFilterText(value)
    } else {
      names.setFilterText(value)
    }
    setValue(value)
  };

  let locations = useAsyncList({
    async load({ signal, filterText }) {
      // Fetch data from the local API
      let res = await fetch(`/api/location?search=${filterText}`, { signal });
      let json = await res.json();

      return {
        items: json.results,
      };
    },
  });
  let names = useAsyncList({
    async load({ signal, filterText }) {
      // Fetch data from the local API
      let res = await fetch(`/api/name?search=${filterText}`, { signal });
      let json = await res.json();

      return {
        items: json.results,
      };
    },
  });


  let results = useAsyncList({
    async load({ signal, filterText }) {
      let res = await fetch(`/api/results?search=${filterText}`, { signal });
      let json = await res.json();
      return { items: json.results };
    },
  });

  const handleSearch = () => {
    if (selected === 'location') {
      results.setFilterText(value);
    } else {
      results.setFilterText(value);
    }
  };



  return (
    <div className="flex flex-col xl:flex-row w-full">
      <Card className="flex items-center justify-center bg-inherit ml-4 border-1">
        <CardBody className="overflow-hidden max-w-md">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
            color="primary"
          >
            <Tab key="location" title="Location">
              <form className="flex flex-col gap-4">


                <Autocomplete
                  // className="max-w-xs"
                  className="max-w-full"
                  inputValue={locations.filterText}
                  isLoading={locations.isLoading}
                  items={locations.items}
                  label="Select a Location"
                  placeholder="Type to search..."
                  variant="bordered"
                  onInputChange={onInputChange}
                  allowsCustomValue={true}
                  onSelectionChange={onSelectionChange}
                >
                  {(item) => (
                    <AutocompleteItem key={item.destination_keyword} className="capitalize">
                      {item.destination}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="hotelname" title="Hotel Name">
              <form className="flex flex-col gap-4">

                <Autocomplete
                  // className="max-w-xs"
                  className="max-w-full"
                  inputValue={names.filterText}
                  isLoading={names.isLoading}
                  items={names.items}
                  label="Select a Hotel Name"
                  placeholder="Type to search..."
                  variant="bordered"
                  onInputChange={onInputChange}
                  allowsCustomValue={true}
                  onSelectionChange={onSelectionChange}
                >
                  {(item) => (
                    <AutocompleteItem key={item.keyword} className="capitalize">
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Search
                  </Button>
                </div>

              </form>
            </Tab>

          </Tabs>
        </CardBody>
        <Button color="primary" className="m-4 w-full max-w-80">
          Start Comparing: {Array.from(selectedKeys).length - 1} Hotels
        </Button>
      </Card>
      <div className="flex flex-col w-full md:flex-row items-center justify-center">
        <div className="w-full ml-10 mr-10 overflow-y-auto">
          <ScrollArea className="h-[90vh] rounded-xl border">
            <div className="p-4 w-full mx-auto">
              <Listbox
                id="listscroll"
                className="p-0 gap-0 overflow-visible shadow-small rounded-medium"
                aria-label="Multiple selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              >
                {results.items.map((item, index) => (
                  <ListboxItem key={item.id}>
                    <Dialog>
                      <Card
                        isBlurred
                        // className="border-none"
                        shadow="sm"
                      >
                        <CardBody>
                          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                            <div className="relative col-span-6 md:col-span-4">
                              <Image
                                alt="Album cover"
                                className="object-cover"
                                height={200}
                                shadow="md"
                                src={item.images.thumbnail[0]}
                                width="100%"
                              />
                            </div>

                            <div className="flex flex-col col-span-6 md:col-span-8">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0">
                                  <h1 className="text-large">{item.title}</h1>
                                  <p className="text-small text-foreground/80">City: {item.city}</p>
                                  <h2 className="text-small font-medium mt-2"> Rating: {item.rating}</h2>
                                  <h2 className="text-small font-medium mt-2">Review: {item.review}</h2>
                                  <h2 className="text-small font-medium mt-2">Total Room: {item.total_room}</h2>
                                </div>
                                <Drawer>
                                  <DrawerTrigger className="p-2 pr-5 pl-5 bg-primary rounded-xl text-background">view</DrawerTrigger>
                                  <DrawerContent>
                                    <DrawerHeader>
                                      <div className="flex items-center justify-between">
                                        <DrawerTitle>Hotel Name: {item.title}</DrawerTitle>
                                        <DrawerClose>
                                          <p className="p-2 pr-5 pl-5 bg-primary rounded-xl text-background">Close</p>
                                        </DrawerClose>
                                      </div>
                                      <DrawerDescription>
                                        <Carousel
                                          opts={{
                                            align: "start",
                                          }}
                                          className="w-fit mx-auto"
                                        >
                                          <CarouselContent>
                                            {item.images.thumbnail.map((url, index) => (
                                              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                                <Image
                                                  height="150"
                                                  className="mx-auto"
                                                  src={url}
                                                  width="250"
                                                />
                                              </CarouselItem>
                                            ))}
                                          </CarouselContent>
                                          <CarouselPrevious />
                                          <CarouselNext />
                                        </Carousel>
                                        <DataTableDemo data={item.prices} />
                                      </DrawerDescription>
                                    </DrawerHeader>
                                  </DrawerContent>
                                </Drawer>

                                {/* <DialogTrigger>
                                  <p className="p-2 bg-primary text-background rounded-medium w-fit font-semibold">
                                    view
                                  </p>
                                </DialogTrigger> */}
                              </div>

                              <div className="flex flex-col mt-3 gap-1">
                                {/* <h2>2</h2> */}
                                <div className="flex justify-between">
                                  <div className="flex w-full items-center justify-evenly text-center">
                                    <div><p>ADR</p><p>${item.adr}</p></div>
                                    <div><p>RevPer</p><p>${item.rev}</p></div>
                                    <div><p>Occupency</p><p>{item.occupancy}%</p></div>
                                  </div>
                                  <p className="text-xl">${item.price}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.title}</DialogTitle>
                          <DialogDescription>
                            <h2>Address Line : {item.firstAddressLine}</h2>
                            <h2>City : {item.city},{item.countryCode}</h2>
                            <br />
                            <div>
                              <Carousel
                                opts={{
                                  align: "start",
                                }}
                                className="w-full"
                              >
                                <CarouselContent>
                                  {item.images.thumbnail.map((url, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                      <Image
                                        alt="Album cover"
                                        height="100%"
                                        shadow="md"
                                        src={url}
                                        width="100%"
                                      />
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel>
                            </div>
                            <div>
                              <DataTableDemo data={item.prices} />
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </ListboxItem>
                ))}
              </Listbox>
            </div>
          </ScrollArea>

        </div>
      </div>
    </div>
  );
}
