import { AnimatePresence } from "framer-motion";
import {
  envEnum,
  ImpactEnum,
  IncidentType,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "../../types/IncidentType";
import { ConfirmationModal } from "../ConfirmationModal";
import { motion } from "framer-motion";
import { Backdrop } from "../Backdrop";
import crossIcon from "../../assets/crossIcon.svg";
import trashIcon from "../../assets/trashIcon.svg";
import { useState } from "react";
import settings from "../../types/AppSettings";
import { AppType } from "../../types/AppType";
import {
  LabelApps,
  LabelButton,
  LabelInput,
  LabelText,
} from "./incidentForm/Sections";
import { useNewIncident } from "../../hooks/useNewIncident";
import { toast } from "sonner";

type Props = {
  handleClose: (e: React.MouseEvent) => void;
  incident: IncidentType;
  apps: AppType[];
};

export default function ManageIncidentForm({
  handleClose,
  incident,
  apps,
}: Props) {
  const newIncident = useNewIncident();
  const [formData, setFormData] = useState(incident);
  const [selectedApps, setSelectedApps] = useState<{
    apps: number[];
    visible: boolean;
  }>({ apps: [], visible: false });
  formData.IncidentApp.map((app) =>
    setSelectedApps({
      ...selectedApps,
      apps: [...selectedApps.apps, app.app.id!],
    })
  );

  const [selectedImpacted, setSelectedImpacted] = useState<{
    apps: number[];
    visible: boolean;
  }>({ apps: [], visible: false });
  formData.IncidentImpact.map((app) =>
    setSelectedImpacted({
      ...selectedImpacted,
      apps: [...selectedImpacted.apps, app.app.id!],
    })
  );
  const [openDropdown, setOpenDropDown] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {
      IncidentApp,
      IncidentImpact,
      start_date,
      end_date,
      description,
      operational_impact,
      ...data
    } = formData;
    console.log({
      ...data,
      apps: selectedApps.apps,
      impacted_apps: selectedImpacted.apps,
    });
    const inc = {
      ...data,
      ...{ start_date: new Date(start_date) },
      ...(end_date && { end_date: new Date(end_date) }),
      ...{ apps: selectedApps.apps },
      ...{ impacted_apps: selectedImpacted.apps },
      ...(description.trim() !== "" && { description: description }),
      ...(operational_impact.trim() !== "" && {
        operational_impact: operational_impact,
      }),
    };
    if (
      inc.apps[0] &&
      inc.title &&
      inc.description &&
      inc.start_date &&
      inc.platform &&
      inc.operational_impact &&
      inc.platform &&
      inc.reported_by &&
      inc.site &&
      inc.status &&
      inc.technical_impact &&
      inc.env
    ) {
      newIncident(inc);
      handleClose(e);
    } else
      toast.error("שדות חובה חסרים", {
        position: "top-center",
        richColors: true,
        className: "toast-rtl",
      });
  };
  return (
    <Backdrop onClick={() => {}}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white-color border border-border w-[clamp(750px,50%,1000px)] flex flex-col gap-4 items-end rounded-lg shadow-md text-tex relative"
        initial={{ opacity: 0, y: "25vh", x: "0%" }}
        animate={{
          opacity: 1,
          y: "0%",
          x: "0%",
          transition: {
            duration: 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          },
        }}
        exit={{
          opacity: 0,
          y: "25vh",
          x: "0%",
        }}
      >
        <div className="flex justify-between flex-row-reverse w-full border-b border-border py-4 px-6">
          <h1 className="font-medium text-2xl">
            {!incident ? "הוסף אירוע" : "ערוך אירוע"}
          </h1>
          <button onClick={handleClose}>
            <img src={crossIcon} alt="" />
          </button>
        </div>

        {/* form */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-6 py-4 w-full"
        >
          <div className="flex flex-row-reverse gap-5 w-full items-start">
            {/* Right column */}
            <div className="flex flex-1 flex-col gap-3">
              <LabelInput
                label="* שם אירוע"
                placeholder="הקלד שם תקלה"
                value={formData.title}
                setValue={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <LabelText
                label="* תיאור תקלה"
                placeholder="הוסף תיאור תקלה"
                value={formData.description}
                setValue={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <LabelButton
                label="* מקור דיווח"
                values={settings.reporterSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.reported_by}
                setType={(value: keyof typeof ReporterEnum) => {
                  setFormData({ ...formData, reported_by: value });
                }}
                dropDownValue="reporter"
              />
              <LabelButton
                label="תשתית"
                values={settings.paltformSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.platform}
                setType={(value: keyof typeof PlatformEnum) => {
                  setFormData({ ...formData, platform: value });
                }}
                dropDownValue="platform"
              />
              <LabelButton
                label="סביבה"
                values={settings.envSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.env}
                setType={(value: keyof typeof envEnum) => {
                  setFormData({ ...formData, env: value });
                }}
                dropDownValue="env"
              />
              <LabelButton
                label="אתר"
                values={settings.siteSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.site}
                setType={(value: keyof typeof SiteEnum) => {
                  setFormData({ ...formData, site: value });
                }}
                dropDownValue="site"
              />
              <LabelInput
                label="מספר טיקט בSNOW"
                placeholder="הוסף מספר טיקט"
                value={formData.snow_ticket || ""}
                setValue={(e) =>
                  setFormData({ ...formData, snow_ticket: e.target.value })
                }
              />
              <div className="flex child:flex-1 justify-start child:flex child:flex-row-reverse child:items-center child:gap-3 h-[4.125rem] ">
                <div>
                  <h5>?עלה בניטור</h5>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        monitored: !formData.monitored,
                      })
                    }
                    type="button"
                    className={`${
                      formData.monitored ? "bg-secondary-text" : ""
                    } rounded-sm border border-secondary-text size-5 text-white-color flex justify-center items-center`}
                  >
                    v
                  </button>
                </div>
                <div>
                  <h5>?דווח לעמ"ר</h5>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        omer_sent: !formData.omer_sent,
                      })
                    }
                    type="button"
                    className={`${
                      formData.omer_sent ? "bg-secondary-text" : ""
                    } rounded-sm border border-secondary-text size-5 text-white-color flex justify-center items-center`}
                  >
                    v
                  </button>
                </div>
              </div>
            </div>
            {/* Left column */}
            <div className="flex flex-1 flex-col gap-3">
              <LabelButton
                label="* משמעות טכנית"
                values={settings.impactSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.technical_impact}
                setType={(value: keyof typeof ImpactEnum) => {
                  setFormData({ ...formData, technical_impact: value });
                }}
                dropDownValue="impact"
              />
              <LabelText
                label="* משמעות מבצעית"
                placeholder="הוסף משמעות מבצעית"
                value={formData.operational_impact}
                setValue={(e) =>
                  setFormData({
                    ...formData,
                    operational_impact: e.target.value,
                  })
                }
              />
              {/* <LabelButton label="מערכות" />
              <LabelButton label="מערכות מושפעות" /> */}
              <LabelApps
                label="מערכות"
                apps={apps}
                value={apps.filter((app) =>
                  selectedApps.apps.includes(app.id!)
                )}
                setValue={(value) => {
                  !selectedApps.apps.includes(value.id)
                    ? setSelectedApps({
                        ...selectedApps,
                        apps: [...selectedApps.apps, value.id],
                      })
                    : setSelectedApps({
                        ...selectedApps,
                        apps: selectedApps.apps.filter(
                          (app) => app !== value.id
                        ),
                      });
                }}
                visible={selectedApps.visible}
                setVisible={(value) =>
                  setSelectedApps({ ...selectedApps, visible: value })
                }
              />
              <LabelApps
                label="מערכות מושפעות"
                apps={apps}
                value={apps.filter((app) =>
                  selectedImpacted.apps.includes(app.id!)
                )}
                setValue={(value) => {
                  !selectedImpacted.apps.includes(value.id)
                    ? setSelectedImpacted({
                        ...selectedImpacted,
                        apps: [...selectedImpacted.apps, value.id],
                      })
                    : setSelectedImpacted({
                        ...selectedImpacted,
                        apps: selectedImpacted.apps.filter(
                          (app) => app !== value.id
                        ),
                      });
                }}
                visible={selectedImpacted.visible}
                setVisible={(value) =>
                  setSelectedImpacted({ ...selectedImpacted, visible: value })
                }
              />

              <LabelInput
                label="* זמן תחילת אירוע"
                type="datetime-local"
                value={formData.start_date}
                setValue={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
              <LabelInput
                label="זמן סיום אירוע"
                type="datetime-local"
                value={formData.end_date || ""}
                setValue={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
              <LabelInput
                label="מספר טיקט בJIRA"
                placeholder="הוסף מספר טיקט"
                value={formData.jira_ticket || ""}
                setValue={(e) =>
                  setFormData({ ...formData, jira_ticket: e.target.value })
                }
              />
              {/* <LabelButton label="* סטטוס" /> */}
              <LabelButton
                label="* סטטוס"
                values={settings.statusSettings}
                openDropDown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                type={formData.status}
                setType={(value: keyof typeof StatusEnum) => {
                  setFormData({ ...formData, status: value });
                }}
                dropDownValue="status"
              />
            </div>
          </div>
          {/* Submit and Cancel buttons */}
          <div className="w-full h-px bg-border"></div>
          <div className="flex justify-between w-full">
            <div className="flex self-start gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white-color rounded-md"
              >
                שמור מערכת
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-white-color text-secondary-text box-border border border-border rounded-md"
              >
                ביטול
              </button>
            </div>
            {incident.id && (
              <button
                type="button"
                className="px-5 py-2 rounded-md flex gap-2 bg-red-50 text-secondary-red items-center"
              >
                מחיקה
                <img src={trashIcon} alt="" />
              </button>
            )}
          </div>
          {/* <AnimatePresence mode="wait">
            {isDeleting && (
              <ConfirmationModal
                title="מחיקת מערכת"
                text="האם אתה בטוח שאתה רוצה למחוק את המערכת? פעולה זו היא בלתי הפיכה"
                // handleSubmit={handleDelete}
                // handleClose={() => setIsDeleting(false)}
              />
            )}
          </AnimatePresence> */}
        </form>
      </motion.div>
    </Backdrop>
  );
}
