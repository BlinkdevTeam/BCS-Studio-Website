import SkewButton from "../ui/buttons/SkewButton";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="flex flex-col justify-center items-center gap-10 mx-auto max-w-full h-screen px-8 text-center text-[#161616]">
        <h3 className="text-[36px] md:text-[48px] lg:text-[72px] font-extrabold whitespace-pre-line leading-20">
          READY TO CREATE {"\n"} SOMETHING BEAUTIFUL?
        </h3>
        <p className="text-[24px] md:text-[36px]">IDEAS MADE EFFECTIVE</p>
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center">
          <SkewButton href="/book-now">BOOK NOW</SkewButton>
          <SkewButton href="/book-now?tab=event">TALK TO OUR TEAM</SkewButton>
        </div>
      </div>
    </footer>
  );
}
