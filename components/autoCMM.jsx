"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Tabs, Tab, Button, Card, CardBody, Listbox, ListboxSection, ListboxItem } from "@nextui-org/react";

import cities from './cities.json'
import titles from './titles.json'
import destinations from './destinations.json'
import { Image } from "@nextui-org/react";

export default function ControllableStates() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const [selected, setSelected] = React.useState("city");

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const [hoteldata, sethoteldata] = React.useState([]);


    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );
    const fetchData = async (search, keyword) => {
        const data = await fetch(`/api/filter?search=${search}&keyword=${keyword}`);
        return data.json();
    }

    const handleSearch = async () => {
        // console.log(searchTerm, selected);
        // user filter api and set column to selected and search term to searchTerm
        const data = await fetchData(searchTerm, selected);
        console.log(data.results);
        sethoteldata(data.results);
    }

    return (
        <div>
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
                        <Tab key="city" title="City">
                            <form className="flex flex-col gap-4">


                                <Autocomplete
                                    options={cities}
                                    filterOptions={(options, { inputValue }) => {
                                        return options
                                            .filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
                                            .slice(0, 100);
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Search by City'
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    onChange={(event, newValue) => setSearchTerm(newValue || '')}
                                />

                                {/* <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary">
                                        Search
                                    </Button>
                                </div> */}
                            </form>
                        </Tab>
                        <Tab key="title" title="Hotel Name">
                            <form className="flex flex-col gap-4">

                                <Autocomplete
                                    options={titles}
                                    filterOptions={(options, { inputValue }) => {
                                        return options
                                            .filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
                                            .slice(0, 100);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Search by Hotel Name'
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    onChange={(event, newValue) => setSearchTerm(newValue || '')}
                                />

                                {/* <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary">
                                        Search
                                    </Button>
                                </div> */}

                            </form>
                        </Tab>
                        <Tab key="destination" title="Destination">
                            <form className="flex flex-col gap-4">

                                <Autocomplete
                                    options={destinations}
                                    filterOptions={(options, { inputValue }) => {
                                        return options
                                            .filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
                                            .slice(0, 100);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Search by Destination'
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    onChange={(event, newValue) => setSearchTerm(newValue || '')}
                                />

                                {/* <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary">
                                        Search
                                    </Button>
                                </div> */}

                            </form>
                        </Tab>

                    </Tabs>
                    <div className="flex gap-2 justify-end">
                        <Button fullWidth color="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                </CardBody>
                <Button color="primary" className="m-4 w-full max-w-80">
                    Start Comparing: {Array.from(selectedKeys).length - 1} Hotels
                </Button>
            </Card>
            <Listbox
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
            >
                {hoteldata.map((item) => (
                    <>
                        <ListboxItem key={item.hotel_id}>
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
                                src={JSON.parse(item.images).thumbnail[0]}
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
                                            </div>

                                            <div className="flex flex-col mt-3 gap-1">
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
                        </ListboxItem>
                    </>
                ))}
            </Listbox>
        </div>
    );
}