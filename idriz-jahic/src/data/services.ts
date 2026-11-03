export type Service = {
  id: string;
  title: string;
  lead: string;
  text: string;
  points: string[];
  art: "weld" | "structure" | "assembly" | "cutting" | "custom";
};

export const SERVICES: Service[] = [
  {
    id: "varjenje",
    title: "MIG / MAG / TIG varjenje",
    lead: "Trdni, čisti in enakomerni zvari, prilagojeni materialu in namenu izdelka.",
    text: "Postopek varjenja izberemo glede na vrsto kovine, debelino materiala in zahteve izdelka. MAG varjenje je primerno za konstrukcijsko jeklo, kjer štejeta trdnost in hitrost izvedbe. TIG varjenje uporabimo pri tanjših materialih in vidnih zvarih, kjer je poleg trdnosti pomemben tudi videz. Pred varjenjem robove pravilno pripravimo, po varjenju pa zvare očistimo.",
    points: ["MAG varjenje konstrukcijskega jekla", "MIG varjenje", "TIG varjenje tankih materialov in vidnih zvarov", "Priprava robov in čiščenje zvarov"],
    art: "weld",
  },
  {
    id: "konstrukcije",
    title: "Kovinske konstrukcije",
    lead: "Jeklene konstrukcije, izdelane natančno po meri in pripravljene za varno montažo.",
    text: "Izdelujemo nosilne in pomožne kovinske konstrukcije – od nadstreškov in podestov do ogrodij za opremo. Pri vsaki konstrukciji sta ključni natančna izmera in pravilna geometrija, saj le tako vsi elementi pri montaži sedejo na svoje mesto. Delo izvedemo po vašem načrtu, skici ali po skupnem dogovoru na ogledu.",
    points: ["Nadstreški in nosilne konstrukcije", "Stopnice, podesti in ograje", "Ogrodja za stroje in opremo", "Izdelava po načrtu ali skici"],
    art: "structure",
  },
  {
    id: "montaza",
    title: "Montaža in popravila",
    lead: "Strokovna montaža kovinskih elementov in zanesljiva popravila obstoječih izdelkov.",
    text: "Kovinske elemente montiramo na lokaciji – poravnano, trdno in varno. Popravljamo poškodovane ali dotrajane kovinske dele, ojačamo obstoječe konstrukcije in saniramo počene zvare. Pred popravilom ocenimo stanje in predlagamo rešitev, ki je smiselna in trajna.",
    points: ["Montaža kovinskih elementov na objektu", "Popravila poškodovanih delov", "Ojačitve obstoječih konstrukcij", "Sanacija počenih zvarov"],
    art: "assembly",
  },
  {
    id: "obdelava",
    title: "Rezanje in obdelava kovin",
    lead: "Priprava materiala po meri – natančni rezi, čisti robovi in pripravljeni spoji.",
    text: "Profile, cevi in pločevino razrežemo na zahtevane mere ter robove obrusimo in očistimo. Za vijačne spoje pripravimo luknje, za varjenje pa ustrezno posnete robove. Dobro pripravljen material je osnova za natančen in kakovosten končni izdelek.",
    points: ["Rezanje profilov, cevi in pločevine po meri", "Brušenje in čiščenje robov", "Vrtanje lukenj za vijačne spoje", "Priprava materiala za varjenje"],
    art: "cutting",
  },
  {
    id: "po-narocilu",
    title: "Varilska in montažna dela po naročilu",
    lead: "Imate posebno zamisel ali težavo s kovino? Skupaj poiščemo izvedljivo rešitev.",
    text: "Poleg standardnih storitev izvajamo tudi varilska in montažna dela po meri – od unikatnih izdelkov do prilagoditev obstoječih kovinskih delov. Opišite, kaj potrebujete, priložite skico ali fotografijo, in pripravili bomo predlog izvedbe ter ponudbo.",
    points: ["Unikatni kovinski izdelki po meri", "Prilagoditve obstoječih izdelkov", "Svetovanje glede izvedbe in materiala", "Izvedba po dogovoru"],
    art: "custom",
  },
];
