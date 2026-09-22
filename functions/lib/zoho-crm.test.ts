import { afterEach, describe, expect, it, vi } from "vitest";
import {
  __resetZohoTokenCacheForTests,
  buildEnquiryDescription,
  buildEnquiryLeadRecord,
  isZohoConfigured,
  splitLeadName,
  upsertEnquiryLead,
} from "./zoho-crm";

afterEach(() => {
  __resetZohoTokenCacheForTests();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("splitLeadName", () => {
  it("puts single token in Last_Name", () => {
    expect(splitLeadName("Aisha")).toEqual({ Last_Name: "Aisha" });
  });

  it("splits first and last", () => {
    expect(splitLeadName("Aisha Rahman")).toEqual({
      First_Name: "Aisha",
      Last_Name: "Rahman",
    });
  });

  it("keeps middle names in First_Name", () => {
    expect(splitLeadName("Aisha Binti Rahman")).toEqual({
      First_Name: "Aisha Binti",
      Last_Name: "Rahman",
    });
  });
});

describe("buildEnquiryLeadRecord", () => {
  const base = {
    name: "Aisha Rahman",
    email: "Aisha@Example.com",
    phone: "+60123456789",
    message: "Interested in cohort",
    source: "https://nexpertsai.com/#enquire",
    programmePage: "Agentic AI",
    course: "agentic-ai-founding",
    channel: "agentic_page",
  };

  it("maps standard fields and lowercases email", () => {
    const record = buildEnquiryLeadRecord({}, base);
    expect(record.First_Name).toBe("Aisha");
    expect(record.Last_Name).toBe("Rahman");
    expect(record.Email).toBe("aisha@example.com");
    expect(record.Phone).toBe("+60123456789");
    expect(record.Mobile).toBe("+60123456789");
    expect(record.Lead_Source).toBe("Website");
    expect(record.Website).toBe("nexpertsai.com");
    expect(record.Company).toBe("Agentic AI");
    expect(record.Description).toContain("Programme: Agentic AI");
    expect(record.Description).toContain("Source site: nexpertsai.com");
    expect(record.Description).toContain("Landing: https://nexpertsai.com/#enquire");
  });

  it("supports Company mode site / off", () => {
    expect(buildEnquiryLeadRecord({ ZOHO_COMPANY_MODE: "site" }, base).Company).toBe("nexpertsai.com");
    expect(buildEnquiryLeadRecord({ ZOHO_COMPANY_MODE: "off" }, base).Company).toBeUndefined();
  });

  it("applies custom field env overrides", () => {
    const record = buildEnquiryLeadRecord(
      {
        ZOHO_LEAD_SOURCE: "Web Enquiry",
        ZOHO_WEBSITE_VALUE: "nexpertsai.com",
        ZOHO_WEBSITE_FIELD: "Website",
        ZOHO_PROGRAMME_FIELD: "Programme_Name",
        ZOHO_LANDING_URL_FIELD: "Landing_Page_URL",
      },
      { ...base, programmePage: "Vibe Coding", course: "vibe-coding-bootcamp", channel: "vibe_page" },
    );
    expect(record.Lead_Source).toBe("Web Enquiry");
    expect(record.Company).toBe("Vibe Coding");
    expect(record.Programme_Name).toBe("Vibe Coding");
    expect(record.Landing_Page_URL).toBe("https://nexpertsai.com/#enquire");
    expect(
      buildEnquiryDescription({
        ...base,
        programmePage: "Vibe Coding",
        course: "vibe-coding-bootcamp",
        channel: "vibe_page",
      }),
    ).toContain("Channel: vibe_page");
  });
});

describe("isZohoConfigured", () => {
  it("requires all three OAuth secrets", () => {
    expect(isZohoConfigured({})).toBe(false);
    expect(
      isZohoConfigured({
        ZOHO_CLIENT_ID: "id",
        ZOHO_CLIENT_SECRET: "secret",
        ZOHO_REFRESH_TOKEN: "rt",
      }),
    ).toBe(true);
  });
});

describe("upsertEnquiryLead", () => {
  const input = {
    name: "Test User",
    email: "test@example.com",
    phone: "+60111111111",
    message: "hello",
    source: "https://nexpertsai.com/",
    programmePage: "Agentic AI",
    course: "agentic-ai-founding",
    channel: "agentic_page",
  };

  it("skips when secrets are missing", async () => {
    const result = await upsertEnquiryLead({}, input);
    expect(result.skipped).toBe(true);
    expect(result.ok).toBe(false);
  });

  it("upserts with duplicate_check_fields Email and retries once on 401", async () => {
    const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/oauth/v2/token")) {
        return new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }), { status: 200 });
      }
      if (u.includes("/Leads/upsert")) {
        const call = fetchMock.mock.calls.filter((c) => String(c[0]).includes("/Leads/upsert")).length;
        if (call === 1) {
          return new Response("unauthorized", { status: 401 });
        }
        return new Response(
          JSON.stringify({
            data: [{ code: "SUCCESS", status: "success", action: "insert", details: { id: "123" } }],
          }),
          { status: 200 },
        );
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertEnquiryLead(
      {
        ZOHO_CLIENT_ID: "id",
        ZOHO_CLIENT_SECRET: "secret",
        ZOHO_REFRESH_TOKEN: "rt",
        ZOHO_ACCOUNTS_URL: "https://accounts.zoho.com",
        ZOHO_API_DOMAIN: "https://www.zohoapis.com",
      },
      input,
    );

    expect(result.ok).toBe(true);
    expect(result.recordId).toBe("123");
    expect(result.action).toBe("insert");

    const upsertCalls = fetchMock.mock.calls.filter((c) => String(c[0]).includes("/Leads/upsert"));
    expect(upsertCalls.length).toBe(2);
    const body = JSON.parse(String(upsertCalls[0]![1]?.body));
    expect(body.duplicate_check_fields).toEqual(["Email"]);
    expect(body.data[0].Email).toBe("test@example.com");
    expect(body.trigger).toEqual(["workflow"]);
  });

  it("treats corporate programme payload distinctly", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/oauth/v2/token")) {
        return new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }), { status: 200 });
      }
      return new Response(
        JSON.stringify({
          data: [{ code: "SUCCESS", status: "success", action: "update", details: { id: "999" } }],
        }),
        { status: 200 },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    await upsertEnquiryLead(
      {
        ZOHO_CLIENT_ID: "id",
        ZOHO_CLIENT_SECRET: "secret",
        ZOHO_REFRESH_TOKEN: "rt",
      },
      {
        ...input,
        programmePage: "Generative AI Corporate",
        course: "generative-ai-corporate",
        channel: "corporate_page",
      },
    );

    const upsertBody = JSON.parse(
      String(fetchMock.mock.calls.find((c) => String(c[0]).includes("/Leads/upsert"))![1]?.body),
    );
    expect(upsertBody.data[0].Description).toContain("Generative AI Corporate");
    expect(upsertBody.data[0].Description).toContain("corporate_page");
  });
});
