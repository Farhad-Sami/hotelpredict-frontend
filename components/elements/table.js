"use client";
import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";

import { Pagination, } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import useSWR from "swr";
import { useTheme } from "next-themes";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App({ selectedKey, selected }) {
    const { theme } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = useState('blur')

    const backdrops = ["opaque", "blur", "transparent"];

    const handleOpen = (backdrop) => {
        setBackdrop(backdrop)
        onOpen();
    }

    const [selectionBehavior, setSelectionBehavior] = useState("toggle");

    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    // if selectedKey & selected is not empty, then use them as search & keyword otherwise set data to []
    const search = selectedKey || "none";
    const keyword = selected || "none";

    const { data, isLoading } = useSWR(`/api/filter?search=${search}&keyword=${keyword}&page=${page}`, fetcher, {
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
                className="animate-ping"
            >
                <g className={theme === 'light' ? "fill-black" : "fill-white"}>
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
                    <TableColumn key="province">Province</TableColumn>
                    <TableColumn key="total_room">Total Room</TableColumn>
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
                                                onPress={() => handleOpen("blur")}
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
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam pulvinar risus non risus hendrerit venenatis.
                                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam pulvinar risus non risus hendrerit venenatis.
                                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                </p>
                                <p>
                                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                                    dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                                    Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                                    Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                                </p>
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
