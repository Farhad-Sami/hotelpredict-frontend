"use client";
import { useState, useEffect } from "react";
// import { Radio, RadioGroup } from "@nextui-org/radio";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";

import { Pagination, } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import useSWR from "swr";
// import { useTheme } from "next-themes";
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

    return (
        <div className="flex flex-col gap-3 w-full h-full">
            <Table
                // aria-label="Example table with client async pagination"
                selectionMode="multiple"
                selectionBehavior={selectionBehavior}
                isStriped
                isHeaderSticky
                classNames={{
                    base: "max-h-[75vh] overflow-scroll overflow-x-hidden overflow-y-hidden"
                }}
            >
                <TableHeader>
                    <TableColumn key="title">Name</TableColumn>
                    <TableColumn key="rating">Rating</TableColumn>
                    <TableColumn key="review">Reviews</TableColumn>
                    <TableColumn key="city">City</TableColumn>
                    <TableColumn key="price">Price</TableColumn>
                    <TableColumn key="occupancy">Occupancy</TableColumn>
                    <TableColumn key="adr">ADR</TableColumn>
                    <TableColumn key="revpar">RevPAR</TableColumn>
                    <TableColumn key="details">Details</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"No data to display."}
                    items={data?.results ?? []}
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
                                                color="primary"
                                                variant="shadow"
                                                onPress={() => handleOpen("blur", item)}
                                                className="capitalize"
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
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Price:</span>
                                        <span>{selectedHotel?.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">OCCUPANCY:</span>
                                        <span>{selectedHotel?.occupancy}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">ADR:</span>
                                        <span>{selectedHotel?.adr}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">RevPAR:</span>
                                        <span>{selectedHotel?.revpar}</span>
                                    </div>
                                    {selectedHotel?.rates && (
                                        <Table 
                                            aria-label="Room rates"
                                            isStriped
                                            className="mt-4"
                                        >
                                            <TableHeader>
                                                <TableColumn key="header">Room Type</TableColumn>
                                                <TableColumn key="rating">Rating</TableColumn>
                                                <TableColumn key="reviews">Reviews</TableColumn>
                                                <TableColumn key="currentPrice">Current Price</TableColumn>
                                                <TableColumn key="totalPrice">Total Price</TableColumn>
                                                <TableColumn key="availability">Availability</TableColumn>
                                            </TableHeader>
                                            <TableBody
                                                items={selectedHotel.rates ?? []}
                                            >
                                                {(item) => (
                                                    <TableRow key={item.header}>
                                                        {(columnKey) => (
                                                            <TableCell>
                                                                {columnKey === "header" ? item.header :
                                                                 columnKey === "rating" ? (item.rating || 'N/A') :
                                                                 columnKey === "reviews" ? (item.reviews || 'N/A') :
                                                                 columnKey === "currentPrice" ? `$${item.rates[0]?.currentPrice || 'N/A'}` :
                                                                 columnKey === "totalPrice" ? `$${item.rates[0]?.totalPrice || 'N/A'}` :
                                                                 columnKey === "availability" ? item.maxAvailability :
                                                                 'N/A'}
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
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
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
