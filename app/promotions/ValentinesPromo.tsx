import Link from "next/link";

export default function ValentinesPromo() {
  return (
    <>
      <section className="bg-white flex flex-col overflow-hidden">
        <div className="bg-[#A30A24] flex flex-col justify-center items-center gap-12 text-white py-28 px-6">
          <div className="max-w-320 w-full flex flex-col justify-center items-center mx-auto text-center">
            <h1 className="text-[48px] md:text-[72px] font-bold">
              Valentine’s Day Special - 30% OFF
            </h1>
            <div className="w-fit">
              <p className="text-[24px] md:text-[36px]">
                Book a couple portrait session and get 30% off your entire
                package!
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="bg-white border-2 px-6 py-3 text-[#A30A24] text-[24px] md:text-[36px] font-bold"
          >
            BOOK NOW
          </Link>
        </div>
      </section>
    </>
  );
}
