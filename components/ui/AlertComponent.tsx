import { WORKDAY_MINUTES, WORKDAY_TOLERANCE_MINUTES } from "@/constants/timeRules";

const AlertComponent = () => {
  const message = 'Se bater o ponto agora, excederá o limite diário de ' + WORKDAY_MINUTES/60 + 'h' + (WORKDAY_TOLERANCE_MINUTES ? WORKDAY_TOLERANCE_MINUTES + 'min.' : '.');
  return (
    <div className="relative flex place-self-center items-center justify-center shadow-[-0.5px_0.5px_1px_0.75px_#e0cf2f] -top-[123%] w-[65%] z-50 border-2 border-yellow-400/[0.78] bg-[#DCD8AA] rounded-md p-2">
      <div className="text-gray-900 text-center text-[11px] font-bold z-[55]">{message}</div>
      <div className="absolute left-1/2 -translate-x-1/2 border-solid -bottom-[12px] border-x-[12px] border-t-[12px] border-x-transparent border-t-yellow-400/[0.78] z-[48]" >
        <div className="absolute top-[-12px] left-[-9.5px] border-solid border-x-[10px] border-x-transparent border-t-[10px] border-t-[#DCD8AA] z-[52]" />
      </div>
    </div>
  );
};

export default AlertComponent;
