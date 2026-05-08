
'use client';

import { useEffect, useState } from "react";
import { account } from "../appwrite";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import NavBar from "@/components/NavBar";
import PageLoadingShell from "@/components/PageLoadingShell";
import ConfirmSettingsChangeModal from "@/components/ui/ConfirmSettingsChangeModal";
import {
  getStrictTimeRulingPreference,
  updateStrictTimeRulingPreference,
} from "../../utils/preferences";

const SettingsPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [strictTimeRuling, setStrictTimeRuling] = useState(true);
  const [isSavingStrictTimeRuling, setIsSavingStrictTimeRuling] = useState(false);
  const [showStrictRulingConfirmModal, setShowStrictRulingConfirmModal] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    account
      .get()
      .then((user) => {
        setSelectedDate(new Date());
        setStrictTimeRuling(getStrictTimeRulingPreference(user.prefs as Record<string, unknown>));
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const persistStrictTimeRulingChange = async () => {
    const nextValue = !strictTimeRuling;

    setStrictTimeRuling(nextValue);
    setIsSavingStrictTimeRuling(true);

    try {
      await updateStrictTimeRulingPreference(nextValue);
    } catch (error) {
      console.error("Failed to update strict time ruling preference:", error);
      setStrictTimeRuling(!nextValue);
    } finally {
      setIsSavingStrictTimeRuling(false);
      if (!nextValue) {
        setIsAdvancedOpen(false);
      }
    }
  };

  const requestStrictTimeRulingToggle = () => {
    if (isSavingStrictTimeRuling) {
      return;
    }

    setShowStrictRulingConfirmModal(true);
  };

  const handleCancelStrictRulingChange = () => {
    if (isSavingStrictTimeRuling) {
      return;
    }

    setShowStrictRulingConfirmModal(false);
  };

  const handleConfirmStrictRulingChange = async () => {
    await persistStrictTimeRulingChange();
    setShowStrictRulingConfirmModal(false);
  };

  if (loading || !selectedDate) {
    return <PageLoadingShell />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <ConfirmSettingsChangeModal
        open={showStrictRulingConfirmModal}
        isSaving={isSavingStrictTimeRuling}
        onCancel={handleCancelStrictRulingChange}
        onConfirm={handleConfirmStrictRulingChange}
      />

      <NavBar
        iconHouse={true}
        iconProfile={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
        <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-gray-100 font-medium">Strict time ruling</p>
              <p className="text-sm text-gray-400 mt-1">
                {strictTimeRuling
                  ? "All current time rules are active."
                  : "Only basic time order checks are active."}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={strictTimeRuling}
              aria-label="Toggle strict time ruling"
              onClick={requestStrictTimeRulingToggle}
              disabled={isSavingStrictTimeRuling}
              className={`relative inline-flex h-8 w-16 items-center rounded-full border border-transparent transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#59ff00] focus:ring-offset-2 focus:ring-offset-gray-800 ${
                strictTimeRuling ? "bg-green-600/90" : "bg-gray-600"
              } ${isSavingStrictTimeRuling ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-gray-200 shadow-md transition duration-300 ease-out ${
                  strictTimeRuling ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {strictTimeRuling && (
            <div className="-mx-6 border-t border-gray-700/80">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen((prev) => !prev)}
                className={`w-full px-6 py-2.5 flex items-center justify-between text-left transition-colors rounded-b-md hover:bg-gray-700/30 ${isAdvancedOpen ? "mb-0" : "-mb-6"}`}
                aria-expanded={isAdvancedOpen}
              >
                <span className="text-sm text-gray-200 font-medium">Advanced options</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-gray-300 transition-transform duration-300 ${isAdvancedOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${isAdvancedOpen ? "grid-rows-[1fr] opacity-100 -mb-3" : "grid-rows-[0fr] opacity-0 mb-0"}`}
              >
                <div className="overflow-hidden border-t px-2 border-gray-700/70">
                  <div className="px-6 py-2 text-xs text-gray-400">
                    Advanced strict-rule controls will be implemented here.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
