"use client";
import { useState,useMemo } from "react";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";

import { Pagination, } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App() {
    const [selectionBehavior, setSelectionBehavior] = useState("toggle");

    const [page, setPage] = useState(1);

    const { data, isLoading } = useSWR(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 20;

    const pages = useMemo(() => {
        return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
    }, [data?.count, rowsPerPage]);

    const loadingState = isLoading || data?.results.length === 0 ? "loading" : "idle";

    return (
        <div className="flex flex-col gap-3 m-5 w-full h-full">
            <Table
                aria-label="Example table with client async pagination"
                selectionMode="multiple"
                selectionBehavior={selectionBehavior}
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
            >
                <TableHeader>
                    <TableColumn key="name">Name</TableColumn>
                    <TableColumn key="height">Height</TableColumn>
                    <TableColumn key="mass">Mass</TableColumn>
                    <TableColumn key="birth_year">Birth year</TableColumn>
                </TableHeader>
                <TableBody
                    items={data?.results ?? []}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                >
                    {(item) => (
                        <TableRow key={item?.name}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <RadioGroup
                className="mx-auto p-5"
                orientation="horizontal"
                value={selectionBehavior}
                onValueChange={setSelectionBehavior}
            >
                <Radio value="toggle">Select Hotels</Radio>
                <Radio value="replace">View Analytics</Radio>
            </RadioGroup>

        </div>
    );
}
