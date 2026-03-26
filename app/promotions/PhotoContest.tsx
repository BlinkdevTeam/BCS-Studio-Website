import SkewButton from "@/components/ui/buttons/SkewButton";
import Link from "next/link";

export default function PhotoContest() {
  return (
    <>
      <section className="bg-[#F2F2F2] flex flex-col p-8 md:p-20 overflow-hidden">
        <div className="flex flex-col justify-center items-center gap-12 border-4 border-[#A30A24] text-white py-28 px-6">
          <div className="max-w-320 w-full flex flex-col justify-center items-center mx-auto text-center">
            <h1 className="text-[48px] md:text-[72px] text-[#191919] font-extrabold">
              Photo Contents
            </h1>
            <div className="w-fit">
              <p className="text-[24px] md:text-[36px] text-[#808080]">
                Submit your best photograph for a chance to win amazing prizes!
                Theme: &quot;Moments of Joy&quot;
              </p>
            </div>
            <h4 className="text-[36px] md:text-[48px] text-[#191919] font-bold">
              Grand Prize: P500 + Free Portrait Session
            </h4>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center text-center gap-6 md:gap-8 px-2 sm:px-6">
            <SkewButton href="#" className="flex justify-center items-center">
              Submission Deadline: March 30, 2026
            </SkewButton>
            <SkewButton href="#" className="flex justify-center items-center">
              SUBMIT YOUR PHOTO
            </SkewButton>
          </div>
        </div>
      </section>
    </>
  );
}
