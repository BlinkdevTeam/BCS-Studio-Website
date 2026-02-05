import CurrentPromo from "./CurrentPromo";
import PhotoContest from "./PhotoContest";
import ValentinesPromo from "./ValentinesPromo";

export default function Promotions() {
  return (
    <>
      <section className="bg-white flex flex-col overflow-hidden">
        <div className="bg-[#161616] text-white py-28 px-6">
          <div className="max-w-220 w-full flex flex-col justify-center items-center mx-auto text-center">
            <h1 className="text-[72px] md:text-[96px] font-bold">
              Special Offers
            </h1>
            <div className="w-fit">
              <p className="text-[24px] md:text-[36px]">
                Exclusive deals, exciting events, and amazing contests
              </p>
            </div>
          </div>
        </div>
        <ValentinesPromo />
        <CurrentPromo />
        <PhotoContest />
      </section>
    </>
  );
}
