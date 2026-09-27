"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

import { AppButton } from "@/components/common/ui/app-button";
import { AppCheckbox } from "@/components/common/ui/app-checkbox";
import { AppFormError } from "@/components/common/ui/app-form-error";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import { AppLink } from "@/components/common/ui/app-link";
import { AppMultiSelect } from "@/components/common/ui/app-multi-select/app-multi-select";
import { AppRadioGroup } from "@/components/common/ui/app-radio-group";
import {
  AppSelect,
  type AppSelectOption,
} from "@/components/common/ui/app-select";
import { AppSpinner } from "@/components/common/ui/app-spinner";
import { AppSwitch } from "@/components/common/ui/app-switch";
import {
  AppTable,
  type AppTableColumn,
} from "@/components/common/ui/app-table/app-table";
import { AppTableActions } from "@/components/common/ui/app-table/AppTableActions";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { AppTextarea } from "@/components/common/ui/app-textarea";
import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { AppCardDescription } from "@/components/common/ui/card/app-card-description";
import { AppCardHeader } from "@/components/common/ui/card/app-card-header";

const options: AppSelectOption[] = [
  { label: "مهندسی", value: "engineering" },
  { label: "طراحی", value: "design" },
  { label: "مالی", value: "finance" },
  { label: "سایر", value: "other", disabled: true },
];

type PreviewMember = {
  id: number;
  name: string;
  role: string;
  unit: string;
  status: "فعال" | "در انتظار";
};

const members: PreviewMember[] = [
  {
    id: 1,
    name: "نسترن احمدی",
    role: "مدیر تیم",
    unit: "مهندسی",
    status: "فعال",
  },
  {
    id: 2,
    name: "آرمان رضایی",
    role: "طراح محصول",
    unit: "طراحی",
    status: "فعال",
  },
  {
    id: 3,
    name: "سارا کریمی",
    role: "تحلیل‌گر",
    unit: "مالی",
    status: "در انتظار",
  },
];

function DemoSection({
  id,
  title,
  description,
  parts,
  children,
}: {
  id: string;
  title: string;
  description: string;
  parts?: string[];
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-border py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 dir="ltr" className="w-fit text-lg font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {parts?.length ? (
          <div dir="ltr" className="flex max-w-full flex-wrap gap-1.5">
            {parts.map((part) => (
              <code
                key={part}
                className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {part}
              </code>
            ))}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Sample({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function ComponentShowcase() {
  const [inputValue, setInputValue] = useState("Simorgh workspace");
  const [selectValue, setSelectValue] = useState("engineering");
  const [radioValue, setRadioValue] = useState("design");
  const [multiValue, setMultiValue] = useState(["engineering", "design"]);
  const [tabValue, setTabValue] = useState<"overview" | "members" | "locked">("overview");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([2]);
  const [showEmptyTable, setShowEmptyTable] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [switchChecked, setSwitchChecked] = useState(true);

  const memberColumns: AppTableColumn<PreviewMember>[] = [
    { key: "name", header: "نام" },
    { key: "role", header: "نقش" },
    { key: "unit", header: "واحد" },
    {
      key: "status",
      header: "وضعیت",
      render: (member) => (
        <span
          className={
            member.status === "فعال"
              ? "font-medium text-success"
              : "font-medium text-warning"
          }
        >
          {member.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "عملیات",
      render: (member) => (
        <AppTableActions
          onView={() => toast.info(`نمایش ${member.name}`)}
          onEdit={() => toast.info(`ویرایش ${member.name}`)}
          onDelete={() => toast.error(`حذف ${member.name}`)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <p className="text-xs font-semibold uppercase text-primary">
            Simorgh UI / 2026
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl">
                کاتالوگ اجزای رابط
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                پیش‌نمایش زنده‌ی کامپوننت‌ها، حالت‌های تعاملی و پالت فعلی با رنگ
                اصلی #E05302.
              </p>
            </div>
            <p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              ۲۸ کامپوننت · کنترل‌های زنده
            </p>
          </div>
          <nav
            aria-label="بخش‌های کاتالوگ"
            className="mt-7 flex max-w-full gap-1 overflow-x-auto pb-1"
          >
            {[
              ["theme", "رنگ‌ها"],
              ["actions", "اقدام‌ها"],
              ["forms", "فرم"],
              ["choices", "انتخاب"],
              ["navigation", "تب‌ها"],
              ["data", "داده"],
              ["feedback", "بازخورد"],
            ].map(([href, label]) => (
              <AppLink
                key={href}
                href={`#${href}`}
                variant="nav"
                className="shrink-0"
              >
                {label}
              </AppLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <DemoSection
          id="theme"
          title="Theme tokens"
          description="توکن‌های رنگی که در کنترل‌های زیر استفاده می‌شوند؛ رنگ‌های اصلی، حالت‌ها و رنگ‌های معنایی."
        >
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ["primary", "Primary · #E05302", "bg-primary"],
              ["hover", "Primary hover", "bg-primary-hover"],
              ["pressed", "Primary active", "bg-primary-active"],
              ["accent", "Accent", "bg-accent"],
              ["surface", "Surface", "bg-surface"],
              ["muted", "Muted", "bg-muted"],
              ["success", "Success", "bg-success"],
              ["warning", "Warning", "bg-warning"],
              ["destructive", "Destructive", "bg-destructive"],
              ["info", "Info", "bg-info"],
            ].map(([key, label, colorClass]) => (
              <div key={key} className="min-w-0 space-y-2">
                <div
                  className={`h-14 rounded-lg border border-border ${colorClass}`}
                />
                <p dir="ltr" className="text-xs text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </DemoSection>

        <DemoSection
          id="actions"
          title="AppButton"
          parts={["AppLink"]}
          description="گونه‌ها، اندازه‌ها، آیکن‌ها، حالت غیرفعال و بارگذاری؛ لینک‌ها هم‌راستا با همان توکن‌ها هستند."
        >
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <Sample title="گونه‌ها">
              <div className="flex flex-wrap items-center gap-3">
                <AppButton type="button">اصلی</AppButton>
                <AppButton type="button" variant="secondary">
                  ثانویه
                </AppButton>
                <AppButton type="button" variant="destructive">
                  مخرب
                </AppButton>
                <AppButton type="button" variant="ghost">
                  شفاف
                </AppButton>
              </div>
            </Sample>
            <Sample title="اندازه و حالت‌ها">
              <div className="flex flex-wrap items-center gap-3">
                <AppButton type="button" size="sm">
                  کوچک
                </AppButton>
                <AppButton type="button" size="lg">
                  بزرگ
                </AppButton>
                <AppButton type="button" startIcon={<Sparkles />}>
                  با آیکن
                </AppButton>
                <AppButton type="button" endIcon={<ArrowLeft />}>
                  پایان آیکن
                </AppButton>
                <AppButton type="button" disabled>
                  غیرفعال
                </AppButton>
                <AppButton type="button" loading>
                  در حال بارگذاری
                </AppButton>
              </div>
            </Sample>
            <Sample title="گونه‌های AppLink">
              <div className="flex flex-wrap items-center gap-3">
                <AppLink href="#actions">پیش‌فرض</AppLink>
                <AppLink href="#actions" variant="primary">
                  اصلی
                </AppLink>
                <AppLink href="#actions" variant="secondary">
                  ثانویه
                </AppLink>
                <AppLink href="#actions" variant="nav">
                  ناوبری
                </AppLink>
                <AppLink
                  href="#actions"
                  variant="unstyled"
                  className="underline underline-offset-4"
                >
                  بدون استایل
                </AppLink>
              </div>
            </Sample>
          </div>
        </DemoSection>

        <DemoSection
          id="forms"
          title="AppInput · AppTextarea · AppFormField · AppFormError"
          parts={["AppInput", "AppTextarea", "AppFormField", "AppFormError"]}
          description="ورودی‌های متنی با مقدار قابل‌ویرایش، فقط‌خواندنی، غیرفعال و نامعتبر؛ فیلد فرم نیز برچسب، راهنما، الزام و خطا را نمایش می‌دهد."
        >
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <Sample title="AppInput · مقدار کنترل‌شده">
              <AppFormField
                label="نام محیط"
                htmlFor="preview-input"
                hint="مقدار را ویرایش کنید؛ مقدار در state نگهداری می‌شود."
              >
                <AppInput
                  id="preview-input"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                />
              </AppFormField>
            </Sample>
            <Sample title="AppInput · فقط‌خواندنی و غیرفعال">
              <div className="grid gap-3 sm:grid-cols-2">
                <AppFormField label="شناسه" htmlFor="preview-readonly">
                  <AppInput id="preview-readonly" value="ORG-2048" readOnly />
                </AppFormField>
                <AppFormField label="کد دعوت" htmlFor="preview-disabled-input">
                  <AppInput
                    id="preview-disabled-input"
                    value="SIM-000"
                    disabled
                    readOnly
                  />
                </AppFormField>
              </div>
            </Sample>
            <Sample title="AppInput · نوع ایمیل و خطا">
              <AppFormField
                label="ایمیل سازمانی"
                htmlFor="preview-email"
                required
                error="قالب ایمیل معتبر نیست."
              >
                <AppInput
                  id="preview-email"
                  type="email"
                  defaultValue="team.example"
                  invalid
                  aria-invalid="true"
                />
              </AppFormField>
            </Sample>
            <Sample title="AppTextarea · قابل‌ویرایش و فقط‌خواندنی">
              <div className="grid gap-3 sm:grid-cols-2">
                <AppFormField
                  label="توضیحات"
                  htmlFor="preview-textarea"
                  hint="۴ ردیف پیش‌فرض؛ امکان تغییر اندازه با className."
                >
                  <AppTextarea
                    id="preview-textarea"
                    defaultValue="یادداشت نمونه برای تیم"
                    rows={3}
                    className="resize-y"
                  />
                </AppFormField>
                <AppFormField
                  label="یادداشت قفل‌شده"
                  htmlFor="preview-readonly-textarea"
                >
                  <AppTextarea
                    id="preview-readonly-textarea"
                    defaultValue="این مقدار فقط خواندنی است."
                    readOnly
                    rows={3}
                  />
                </AppFormField>
              </div>
            </Sample>
            <Sample title="AppTextarea · غیرفعال و نامعتبر">
              <div className="grid gap-3 sm:grid-cols-2">
                <AppTextarea
                  aria-label="متن غیرفعال"
                  defaultValue="غیرفعال"
                  disabled
                />
                <AppTextarea
                  aria-label="متن نامعتبر"
                  defaultValue="ورودی نامعتبر"
                  invalid
                  aria-invalid="true"
                />
              </div>
            </Sample>
            <Sample title="AppFormField · اختیاری در برابر الزامی">
              <AppFormField
                label="توضیح کوتاه"
                htmlFor="preview-hint"
                required
                hint="راهنما با پیام خطا جایگزین می‌شود."
              >
                <AppInput id="preview-hint" placeholder="توضیح را وارد کنید" />
              </AppFormField>
            </Sample>
            <Sample title="AppFormError · پیام مستقل">
              <AppFormError message="دسترسی به این مقدار مجاز نیست." />
              <AppFormError />
            </Sample>
          </div>
        </DemoSection>

        <DemoSection
          id="choices"
          title="AppCheckbox · AppSwitch · AppSelect · AppRadioGroup · AppMultiSelect"
          parts={[
            "AppCheckbox",
            "AppSwitch",
            "AppSelect",
            "AppRadioGroup",
            "AppMultiSelect",
            "AppMultiSelectTrigger",
            "AppMultiSelectPanel",
            "AppMultiSelectTags",
          ]}
          description="کنترل‌های انتخابی با حالت کنترل‌شده، گزینه‌ی غیرفعال، خطا و disabled؛ چندانتخابی را باز کنید تا جست‌وجو، انتخاب و برچسب‌ها را ببینید."
        >
          <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
            <Sample title="AppCheckbox · روشن، خاموش و غیرفعال">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <AppCheckbox
                    checked={checkboxChecked}
                    onChange={(event) =>
                      setCheckboxChecked(event.target.checked)
                    }
                  />
                  انتخاب‌شده
                </label>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <AppCheckbox />
                  انتخاب‌نشده
                </label>
                <label className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground">
                  <AppCheckbox disabled />
                  غیرفعال
                </label>
                <label className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground">
                  <AppCheckbox disabled defaultChecked />
                  غیرفعال و انتخاب‌شده
                </label>
              </div>
            </Sample>
            <Sample title="AppSwitch · کنترل‌شده و غیرفعال">
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                <label className="flex min-h-11 items-center gap-3 text-sm">
                  <AppSwitch
                    checked={switchChecked}
                    onChange={(event) => setSwitchChecked(event.target.checked)}
                  />
                  {switchChecked ? "فعال" : "خاموش"}
                </label>
                <label className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
                  <AppSwitch disabled />
                  غیرفعال
                </label>
                <label className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
                  <AppSwitch disabled defaultChecked />
                  غیرفعال و روشن
                </label>
              </div>
            </Sample>
            <Sample title="AppSelect · کنترل‌شده و گزینه‌ی غیرفعال">
              <AppFormField label="واحد سازمانی" htmlFor="preview-select">
                <AppSelect
                  id="preview-select"
                  options={options}
                  value={selectValue}
                  onChange={(event) => setSelectValue(event.target.value)}
                />
              </AppFormField>
              <AppFormField
                label="انتخاب نامعتبر"
                htmlFor="preview-invalid-select"
                error="یک واحد معتبر انتخاب کنید."
              >
                <AppSelect
                  id="preview-invalid-select"
                  options={options}
                  placeholder="انتخاب واحد"
                  invalid
                  aria-invalid="true"
                />
              </AppFormField>
              <AppSelect
                aria-label="انتخاب غیرفعال"
                options={options}
                value="finance"
                disabled
              />
            </Sample>
            <Sample title="AppRadioGroup · جهت افقی و عمودی">
              <AppRadioGroup
                name="preview-radio-main"
                label="نمایش پیش‌فرض عمودی"
                options={options}
                value={radioValue}
                onChange={(event) => setRadioValue(event.target.value)}
              />
              <AppRadioGroup
                name="preview-radio-horizontal"
                label="نمایش افقی و کل گروه غیرفعال"
                options={options.slice(0, 3)}
                defaultValue="engineering"
                orientation="horizontal"
                disabled
              />
            </Sample>
            <Sample title="AppMultiSelect · مقدار کنترل‌شده">
              <AppFormField
                label="واحدهای همکار"
                htmlFor="preview-multi-select"
                hint="جست‌وجو کنید و چند گزینه را انتخاب کنید."
              >
                <AppMultiSelect
                  id="preview-multi-select"
                  options={options}
                  value={multiValue}
                  onChange={setMultiValue}
                  placeholder="انتخاب واحدها"
                />
              </AppFormField>
            </Sample>
            <Sample title="AppMultiSelect · خطا و غیرفعال">
              <AppFormField
                label="انتخاب نامعتبر"
                htmlFor="preview-invalid-multi"
                error="حداقل یک واحد انتخاب کنید."
              >
                <AppMultiSelect
                  id="preview-invalid-multi"
                  options={options}
                  value={[]}
                  onChange={() => undefined}
                  invalid
                  placeholder="بدون انتخاب"
                />
              </AppFormField>
              <AppMultiSelect
                id="preview-disabled-multi"
                options={options}
                value={["engineering"]}
                onChange={() => undefined}
                disabled
              />
            </Sample>
          </div>
        </DemoSection>

        <DemoSection
          id="navigation"
          title="AppTab"
          parts={["AppTabList", "AppTabTrigger", "AppTabContent"]}
          description="تب کنترل‌شده با تغییر مقدار، محتوای متناظر و یک گزینه‌ی غیرفعال."
        >
          <AppTab
            tabNames={[
              { value: "overview", label: "نمای کلی" },
              { value: "members", label: "اعضا" },
              { value: "locked", label: "بایگانی", disabled: true },
            ]}
            value={tabValue}
            onValueChange={setTabValue}
            tabContents={{
              overview: (
                <p className="text-sm leading-6 text-muted-foreground">
                  محتوای تب نمای کلی. تب انتخاب‌شده، نوار نارنجی پوسته را نمایش
                  می‌دهد.
                </p>
              ),
              members: (
                <p className="text-sm leading-6 text-muted-foreground">
                  محتوای تب اعضا؛ با انتخاب تب، state کنترل‌شده تغییر می‌کند.
                </p>
              ),
              locked: (
                <p className="text-sm leading-6 text-muted-foreground">
                  این محتوا در حالت disabled قابل انتخاب نیست.
                </p>
              ),
            }}
          />
        </DemoSection>

        <DemoSection
          id="data"
          title="AppTable · AppTableActions · AppCard"
          parts={[
            "AppTableHeader",
            "AppTableBody",
            "AppTableActions",
            "AppCardHeader",
            "AppCardContent",
            "AppCardDescription",
          ]}
          description="جدول با انتخاب ردیف، سرستون select-all، سلول سفارشی، حالت خالی و عملیات؛ کارت نمونه نیز تمام building blockهای کارت را ترکیب می‌کند."
        >
          <div className="space-y-8">
            <Sample title="AppTable · انتخاب ردیف، عملیات و حالت خالی">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <label className="flex min-h-11 items-center gap-3 text-sm">
                  <AppSwitch
                    checked={showEmptyTable}
                    onChange={(event) =>
                      setShowEmptyTable(event.target.checked)
                    }
                  />
                  نمایش جدول خالی
                </label>
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  {selectedMembers.length} ردیف انتخاب شده
                </p>
              </div>
              <AppTable
                caption="اعضای نمونه‌ی سازمان"
                columns={memberColumns}
                data={showEmptyTable ? [] : members}
                rowKey={(member) => member.id}
                rowLabel={(member) => member.name}
                selectedKeys={selectedMembers}
                onSelectionChange={setSelectedMembers}
                emptyMessage="عضوی برای نمایش وجود ندارد."
              />
            </Sample>
            <Sample title="AppCard · اجزای کارت">
              <AppCard className="max-w-xl">
                <AppCardHeader>
                  <h3 className="text-base font-semibold">واحد مهندسی</h3>
                  <AppCardDescription>
                    نمونه‌ی کارت با توضیح کوتاه و محتوای سفارشی.
                  </AppCardDescription>
                </AppCardHeader>
                <AppCardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      ۱۲ عضو · ۳ تیم
                    </p>
                    <AppButton type="button" size="sm" variant="secondary">
                      مشاهده واحد
                    </AppButton>
                  </div>
                </AppCardContent>
              </AppCard>
            </Sample>
          </div>
        </DemoSection>

        <DemoSection
          id="feedback"
          title="AppSpinner · AppToast"
          parts={["AppToast"]}
          description="لودر در چند اندازه و اعلان‌های موفقیت، اطلاع‌رسانی و خطا. ظرف AppToast در ریشه‌ی برنامه mount شده است."
        >
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <Sample title="AppSpinner · اندازه و کلاس سفارشی">
              <div className="flex min-h-12 items-center gap-6 text-primary">
                <AppSpinner />
                <AppSpinner className="size-6 border-[3px]" />
                <AppSpinner className="size-8 border-4" />
              </div>
            </Sample>
            <Sample title="AppToast · نوع اعلان">
              <div className="flex flex-wrap gap-3">
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={() => toast.success("تغییرات ذخیره شد.")}
                >
                  موفقیت
                </AppButton>
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={() => toast.info("این یک پیام اطلاع‌رسانی است.")}
                >
                  اطلاع‌رسانی
                </AppButton>
                <AppButton
                  type="button"
                  variant="destructive"
                  onClick={() => toast.error("ذخیره‌سازی انجام نشد.")}
                >
                  خطا
                </AppButton>
              </div>
            </Sample>
          </div>
        </DemoSection>
      </main>

      <footer className="mt-4 border-t border-border bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <span>Simorgh UI · Theme preview</span>
          <AppLink href="#theme" variant="default" className="font-medium">
            بازگشت به رنگ‌ها{" "}
            <Check aria-hidden="true" className="inline size-3.5" />
          </AppLink>
        </div>
      </footer>
    </div>
  );
}
