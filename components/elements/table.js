"use client";
import { useState, useEffect, useMemo } from "react";
// import { Radio, RadioGroup } from "@nextui-org/radio";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";

import { Pagination, } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import useSWR from "swr";
// import { useTheme } from "next-themes";
import { Input } from "@nextui-org/input";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App({ selectedKey, selected, dateRange }) {
    // const { theme } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = useState('blur')
    const [selectedHotel, setSelectedHotel] = useState(null);

    const handleOpen = (backdrop, hotel) => {
        setSelectedHotel(hotel);
        setBackdrop(backdrop);
        onOpen();
    }

    const [selectionBehavior, setSelectionBehavior] = useState("toggle");

    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    useEffect(() => {
        setPage(0);
        setPages(0);
    }, [selected]);
    // if selectedKey & selected is not empty, then use them as search & keyword otherwise set data to []
    const search = selectedKey || "none";
    const keyword = selected || "none";

    const { data, isLoading } = useSWR(`/api/filter?search=${search}&keyword=${keyword}&page=${page == 0 ? 0 : page - 1}`, fetcher, {
        keepPreviousData: true,
    });
    // const { data, isLoading } = useSWR(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
    //     keepPreviousData: true,
    // });

    const rowsPerPage = 1;
    const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";

    useEffect(() => {
        // console.log(`Loading state changed to: ${loadingState}`);
        if (loadingState === 'idle' && data) {
            setPages(Math.ceil(data?.results?.length / rowsPerPage));
        }
    }, [loadingState, data, rowsPerPage]);

    const LoadingIcon = () => {
        return (
            <svg
                width="40"
                height="40"
                viewBox="0 0 4096 4096"
                fill="currentColor"
                className="animate-ping"
            >
                <g>
                    <path
                        d="m3064.3 1750.9l-276-478.5-498.9 859.2-639.1-393.1 705.3-1215.2-302.1-523.3-849.7 1463.5-263.1 453.7-940.7 1620.8h605.7l781.6-1346.3 639 393.1-553.3 953.2h606.2l393.7-678.2 263-453.7 354.6-610z"
                        fill="currentColor"
                    />
                    <path
                        d="m4096 3538h-1507.3l251.1-460.9h502.8l-258.8-447.9 236.8-434.7z"
                        fill="currentColor"
                    />
                </g>
            </svg>
        );
    };

    const [sortDescriptor, setSortDescriptor] = useState({});

    const handleSortChange = (descriptor) => {
        setSortDescriptor(descriptor);
        if (!data?.results) return;
        
        const sortedItems = [...data.results].sort((a, b) => {
            const first = a[descriptor.column];
            const second = b[descriptor.column];
            const cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

            return descriptor.direction === "descending" ? -cmp : cmp;
        });
        
        data.results = sortedItems;
    };

    const [filterValue, setFilterValue] = useState({
        title: "",
        price: "",
        occupancy: "",
        adr: "",
        revpar: ""
    });

    const filteredItems = useMemo(() => {
        if (!data?.results) return [];
        
        return data.results.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(filterValue.title.toLowerCase());
            const priceMatch = filterValue.price === "" || 
                item.price.toLowerCase().includes(filterValue.price);
            const occupancyMatch = filterValue.occupancy === "" || 
                item.occupancy.toString().includes(filterValue.occupancy);
            const adrMatch = filterValue.adr === "" || 
                item.adr.toString().includes(filterValue.adr);
            const revparMatch = filterValue.revpar === "" || 
                item.revpar.toString().includes(filterValue.revpar);
            
            return titleMatch && priceMatch && occupancyMatch && adrMatch && revparMatch;
        });
    }, [data?.results, filterValue]);

    return (
        <div className="flex flex-col gap-3 w-full h-full">
            <div className="flex flex-col gap-3">
                <div className="flex gap-4 justify-between">
                    <Input
                        isClearable
                        className="w-full"
                        placeholder="Search by name..."
                        value={filterValue.title}
                        onClear={() => setFilterValue(prev => ({ ...prev, title: "" }))}
                        onChange={e => setFilterValue(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                        isClearable
                        // type="number"
                        className="w-full"
                        placeholder="Filter by price..."
                        value={filterValue.price}
                        onClear={() => setFilterValue(prev => ({ ...prev, price: "" }))}
                        onChange={e => setFilterValue(prev => ({ ...prev, price: e.target.value }))}
                    />
                </div>
                {/* <div className="flex gap-4 justify-between mb-4">
                    <Input
                        isClearable
                        type="number"
                        className="w-full"
                        placeholder="Filter by occupancy..."
                        value={filterValue.occupancy}
                        onClear={() => setFilterValue(prev => ({ ...prev, occupancy: "" }))}
                        onChange={e => setFilterValue(prev => ({ ...prev, occupancy: e.target.value }))}
                    />
                    <Input
                        isClearable
                        type="number"
                        className="w-full"
                        placeholder="Filter by ADR..."
                        value={filterValue.adr}
                        onClear={() => setFilterValue(prev => ({ ...prev, adr: "" }))}
                        onChange={e => setFilterValue(prev => ({ ...prev, adr: e.target.value }))}
                    />
                    <Input
                        isClearable
                        type="number"
                        className="w-full"
                        placeholder="Filter by RevPAR..."
                        value={filterValue.revpar}
                        onClear={() => setFilterValue(prev => ({ ...prev, revpar: "" }))}
                        onChange={e => setFilterValue(prev => ({ ...prev, revpar: e.target.value }))}
                    />
                </div> */}
            </div>
            <Table
                // aria-label="Example table with client async pagination"
                selectionMode="multiple"
                isStriped
                isHeaderSticky
                classNames={{
                    base: "max-h-[79vh] overflow-scroll overflow-x-hidden overflow-y-hidden",
                    th: "bg-primary-pink text-white hover:text-black",
                    sortIcon: "text-white",
                }}
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
            >
                <TableHeader>
                    <TableColumn allowsSorting key="title">Name</TableColumn>
                    <TableColumn allowsSorting key="rating">Rating</TableColumn>
                    <TableColumn allowsSorting key="review">Reviews</TableColumn>
                    <TableColumn allowsSorting key="price">Price</TableColumn>
                    <TableColumn allowsSorting key="occupancy">Occupancy</TableColumn>
                    <TableColumn allowsSorting key="adr">ADR</TableColumn>
                    <TableColumn allowsSorting key="revpar">RevPAR</TableColumn>
                    <TableColumn allowsSorting key="accuracy">Accuracy</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"No data to display."}
                    items={filteredItems}
                    loadingContent={<LoadingIcon />}
                    loadingState={loadingState}
                    className="max-h-[25vh] overflow-scroll overflow-x-hidden overflow-y-hidden"
                >
                    {
                        (item) => (
                            <TableRow key={item?.hotel_id}>
                                {(columnKey) => (
                                    <TableCell>
                                        {columnKey === "details" ? (
                                            <Button
                                                size="sm"
                                                radius="full"
                                                className="bg-primary-pink text-white"
                                                variant="shadow"
                                                onPress={() => handleOpen("blur", item)}
                                            >
                                                View
                                            </Button>
                                        ) : (
                                            getKeyValue(item, columnKey)
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <Modal backdrop={backdrop} size="5xl" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {selectedHotel?.title || 'Hotel Details'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-1">
                                    <div className="flex flex-row items-center justify-evenly">
                                        <div className="flex flex-col text-center">
                                            <span className="font-semibold text-primary-pink">Price</span>
                                            <span>{selectedHotel?.price}</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <span className="font-semibold text-primary-pink">OCCUPANCY</span>
                                            <span>{selectedHotel?.occupancy}</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <span className="font-semibold text-primary-pink">ADR</span>
                                            <span>{selectedHotel?.adr}</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <span className="font-semibold text-primary-pink">RevPAR</span>
                                            <span>{selectedHotel?.revpar}</span>
                                        </div>
                                    </div>
                                    {selectedHotel?.rates && (
                                        <Table
                                            aria-label="Room rates"
                                            isStriped
                                            className="mt-4"
                                        >
                                            <TableHeader>
                                                <TableColumn className="bg-primary-pink text-white" key="header">Room Type</TableColumn>
                                                <TableColumn className="bg-primary-pink text-white" key="rating">Rating</TableColumn>
                                                <TableColumn className="bg-primary-pink text-white" key="reviews">Reviews</TableColumn>
                                                <TableColumn className="bg-primary-pink text-white" key="currentPrice">Current Price</TableColumn>
                                                <TableColumn className="bg-primary-pink text-white" key="totalPrice">Total Price</TableColumn>
                                                <TableColumn className="bg-primary-pink text-white" key="availability">Availability</TableColumn>
                                            </TableHeader>
                                            <TableBody
                                                items={selectedHotel.rates ?? []}
                                            >
                                                {(item) => (
                                                    <TableRow key={item.header}>
                                                        {(columnKey) => (
                                                            <TableCell className={columnKey === "header" ? "" : "text-center"}>
                                                                {columnKey === "header" ? item.header :
                                                                    columnKey === "rating" ? (item.rating || '-') :
                                                                        columnKey === "reviews" ? (item.reviews || '-') :
                                                                            columnKey === "currentPrice" ? (item.rates[0]?.currentPrice ? `$${item.rates[0].currentPrice}` : '-') :
                                                                                columnKey === "totalPrice" ? (item.rates[0]?.totalPrice ? `$${item.rates[0].totalPrice}` : '-') :
                                                                                    columnKey === "availability" ? item.maxAvailability :
                                                                                        '-'}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-primary-pink text-white" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {
                pages > 0 ? (
                    <div className="flex w-full justify-center">
                        <Pagination
                            showControls
                            showShadow
                            color="primary"
                            variant="bordered"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                ) : null
            }

            {/* <RadioGroup
                className="mx-auto p-5"
                orientation="horizontal"
                value={selectionBehavior}
                onValueChange={setSelectionBehavior}
            >
                <Radio value="toggle">Select Hotels</Radio>
                <Radio value="replace">View Analytics</Radio>
            </RadioGroup> */}
        </div>
    );
}
