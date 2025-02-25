import React from 'react'
import { Card, CardContent } from './Card';

const Pppp = () => {
    const times = {
        top: "08:14",
        center: "08:15",
        bottom: "08:16",
      };
    
      return (
        <div className="w-[348px] h-[280px]">
          <Card className="relative h-full rounded-2xl border-[#6b6b6b] shadow-[-1px_1px_6px_1.25px_#59ff00]">
            <CardContent className="p-6">
              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="font-['Istok_Web'] text-xl text-[#d9d9d9]">
                  Entrada da Manhã
                </h2>
              </div>
    
              {/* Top Time */}
              <div className="relative w-20 h-[22px] mx-auto mb-2">
                <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffff0d]">
                  88:88
                </div>
                <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffffbf]">
                  {times.top}
                </div>
              </div>
    
              {/* Center Time */}
              <div className="relative w-64 h-[90px] mx-auto my-4">
                <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-[64px] text-center text-[#ffffff14] opacity-90">
                  88:88
                </div>
                <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-[64px] text-center text-white opacity-90 [text-shadow:0px_0px_10px_#59ff00]">
                  {times.center}
                </div>
              </div>
    
              {/* Bottom Time */}
              <div className="relative w-20 h-[22px] mx-auto mb-4">
                <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffff0d]">
                  88:88
                </div>
                <div className="absolute inset-0 font-['Digital_Numbers-Regular'] text-xl text-center text-[#ffffffbf]">
                  {times.bottom}
                </div>
              </div>
    
              {/* Footer */}
              <div className="text-center">
                <span className="font-['Inter'] text-base text-white [text-shadow:0px_0px_1.5px_#59ff00]">
                  Efetivo
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      );
}

export default Pppp