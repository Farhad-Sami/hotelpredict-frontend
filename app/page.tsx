"use client";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { Image } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <br />
        <div className="inline-block max-w-xxl text-center justify-center">
          {/* Ridiculous hotel insights you
      can't find anywhere else. */}
          <span className={title()}>Ridiculous&nbsp;</span>
          <span className={title({ color: "violet" })}>Hotel Insights&nbsp;</span>
          <br />
          <span className={title()}>
            You Can't Find Anywhere Else.
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Our Hotel Insights Are So Sharp, You Make Better Decisions
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={`${buttonStyles({
              // color: "primary",
              radius: "full",
              variant: "shadow",
            })} bg-gradient-to-r from-[hsl(312,100%,62%)] to-[hsl(283,90%,66%)] text-white`}

            href='/hoteliers'
          >
            <SearchIcon size={20} />
            Start as Hotelier
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <SearchIcon size={20} />
            Start as Traveller
          </Link>
        </div>


      </section>

      <section className="sm:mt-6 lg:mt-8 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Unbelievable Hotel Wisdom For Your&nbsp;</span>
              <span className={title({ color: "violet",size:"lg" })}>Online Business</span>
            </h1>
            <p
              className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Mind-Blowing Tips That Turn You Into a Booking Guru.
              Our Insights Take You from Average Traveler to Hotel Whisperer.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              
              <div className="rounded-md shadow">
                <a href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[hsl(312,100%,62%)] to-[hsl(283,90%,66%)] md:py-4 md:text-lg md:px-10">
                  Get started
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a href="#"
                  className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                  Live demo
                </a>
              </div>
            </div>
          </div>

          <div className="lg:inset-y-0 lg:right-0 lg:w-1/2 my-4">
            <Image
              alt="Album cover"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              // height={200}
              shadow="md"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
              width="100%"
            />
          </div>
        </div>

      </section>


<section>
  <br />
  <br />
<div className="relative flex flex-col items-center mx-auto lg:flex-row lg:max-w-5xl lg:mt-12 xl:max-w-6xl">

    <div className="w-full h-64 lg:w-1/2 lg:h-auto">
        <Image
              alt="Album cover"
              className="h-full w-full object-cover"
              shadow="md"
              src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width="100%"
            />
    </div>
    <div
        className="max-w-lg bg-background md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:right-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12">
        <div className="flex flex-col p-16 md:px-16">
            <h2 className="text-2xl font-medium uppercase lg:text-4xl">Game-Changing&nbsp;<span className={title({ color: "violet",size:'sm' })}>Hotel Advice</span></h2>
            <p className="mt-4">
            Never Settle for Ordinary Stays Again.
            Our Tips Turn Ordinary Vacations into Extraordinary Experiences.
            </p>
            <div className="mt-8">
            <Link
            isExternal
            className={`${buttonStyles({
              // color: "primary",
              radius: "full",
              variant: "shadow",
            })} bg-gradient-to-r from-[hsl(312,100%,62%)] to-[hsl(283,90%,66%)] text-white`}

            href='/hoteliers'
          >
            <SearchIcon size={20} />
            Start as Hotelier
          </Link>
            </div>
        </div>
    </div>

</div>

<br />
  <br />
  <br />
</section>

    </main>
  );
}
