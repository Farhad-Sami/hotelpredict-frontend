"use client";
import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import cities from "../data/cities.json";
import destinations from "../data/destinations.json";
import titles from "../data/titles.json";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { DateRangePicker } from "@nextui-org/date-picker";



import MapboxMap from "@/components/elements/mapboxMap";
import Table from "@/components/elements/table";    



export default function App() {
    const [value, setValue] = useState('');
    const [selectedKey, setSelectedKey] = useState(null);
    const [selected, setSelected] = useState("city");
    const [dateRange, setDateRange] = useState(null);


    const filterItems = (items, inputValue) => {
        return items
            .filter(item =>
                item.label.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0, 150);
    };

    const [filteredCityItems, setFilteredCityItems] = useState(cities.slice(0, 150).map(city => ({
        value: city,
        label: city
    })));
    const [filteredTitleItems, setFilteredTitleItems] = useState(titles.slice(0, 150).map(title => ({
        value: title,
        label: title
    })));
    const [filteredDestinationItems, setFilteredDestinationItems] = useState(destinations.slice(0, 150).map(destination => ({
        value: destination,
        label: destination
    })));

    const onSelectionChange = (id) => {
        setSelectedKey(id);
    };

    const onInputChange = (value, type) => {
        setValue(value);

        const allItems = {
            city: cities.map(city => ({ value: city, label: city })),
            title: titles.map(title => ({ value: title, label: title })),
            destination: destinations.map(destination => ({ value: destination, label: destination }))
        };

        switch (type) {
            case 'city':
                setFilteredCityItems(filterItems(allItems.city, value));
                break;
            case 'title':
                setFilteredTitleItems(filterItems(allItems.title, value));
                break;
            case 'destination':
                setFilteredDestinationItems(filterItems(allItems.destination, value));
                break;
        }
    };

    const handleDateRangeChange = (range) => {
        setDateRange(range);
    };

    return (
        <div className="flex w-full p-4 gap-4 flex-col xl:flex-row">

            <Card className="max-w-[full] w-full h-[50vh] xl:w-[50vw] xl:h-[89vh]">
                <CardBody className="overflow-hidden text-center">
                    <Tabs
                        fullWidth
                        size="md"
                        // aria-label="Tabs form"
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                    >
                        <Tab key="city" title="City" className="flex flex-row gap-3">
                            <Autocomplete
                                label="Search a City"
                                variant="bordered"
                                items={filteredCityItems}
                                allowsCustomValue={true}
                                onSelectionChange={onSelectionChange}
                                onInputChange={(value) => onInputChange(value, 'city')}
                            >
                                {(item) => <AutocompleteItem className="text-center" key={item.value}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                            <DateRangePicker
                                label="Select Check-in and Check-out Dates"
                                visibleMonths={2}
                                onChange={handleDateRangeChange}
                                value={dateRange}
                            />
                        </Tab>
                        <Tab key="title" title="Title" className="flex flex-row gap-3">
                            <Autocomplete
                                label="Search a Title"
                                variant="bordered"
                                items={filteredTitleItems}
                                allowsCustomValue={true}
                                onSelectionChange={onSelectionChange}
                                onInputChange={(value) => onInputChange(value, 'title')}
                            >
                                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                            <DateRangePicker
                                label="Select Check-in and Check-out Dates"
                                visibleMonths={2}
                                onChange={handleDateRangeChange}
                                value={dateRange}
                            />
                        </Tab>
                        <Tab key="destination" title="Destination" className="flex flex-row gap-3">
                            <Autocomplete
                                label="Search a Destination"
                                variant="bordered"
                                items={filteredDestinationItems}
                                allowsCustomValue={true}
                                onSelectionChange={onSelectionChange}
                                onInputChange={(value) => onInputChange(value, 'destination')}
                            >
                                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                            <DateRangePicker
                                label="Select Check-in and Check-out Dates"
                                visibleMonths={2}
                                onChange={handleDateRangeChange}
                                value={dateRange}
                            />
                        </Tab>
                    </Tabs>
                    <MapboxMap />
                </CardBody>
            </Card>
            <Table selectedKey={selectedKey} selected={selected} dateRange={dateRange} />
        </div>
    );
}
