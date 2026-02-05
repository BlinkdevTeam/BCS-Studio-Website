import ServiceSection from "./Service";

export default function BookNow() {
  return (
    <>
      <section className="bg-white flex flex-col overflow-hidden">
        <div className="bg-[#A30A24] text-white py-28 px-6">
          <div className="max-w-220 w-full flex flex-col justify-center items-center mx-auto text-center">
            <h1 className="text-[72px] md:text-[96px] font-bold">
              Book Your Session
            </h1>
            <div className="w-fit">
              <p className="text-[24px] md:text-[36px]">
                Choose your service and reserve your perfect time slot
              </p>
            </div>
          </div>
        </div>
        <ServiceSection />
      </section>
    </>
  );
}
