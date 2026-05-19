/**
 * Seed accurate government officials (heads of state, prime ministers,
 * vice presidents, finance ministers) from a curated static dataset.
 *
 *   node scripts/seed-officials-static.js
 *   npm run db:seed-politicians   # push to Supabase after
 */
const fs = require("fs");
const path = require("path");
const { slugifyName } = require("../server/person-utils");

const ROOT = path.resolve(__dirname, "..");
const POLITICIANS_DIR = path.join(ROOT, "data", "politicians");
const COUNTRIES_DIR = path.join(ROOT, "data", "countries");

// iso → [ { office, name } ]
// Data reflects early 2025 government compositions.
const OFFICIALS = {
  AF: [{ office: "Prime Minister", name: "Mohammad Hassan Akhund" }],
  AL: [{ office: "Prime Minister", name: "Edi Rama" }, { office: "Minister of Finance", name: "Erjon Çela" }],
  DZ: [{ office: "President", name: "Abdelmadjid Tebboune" }, { office: "Prime Minister", name: "Nadir Larbaoui" }, { office: "Minister of Finance", name: "Laaziz Faid" }],
  AD: [{ office: "Prime Minister (Cap de Govern)", name: "Xavier Espot Zamora" }, { office: "Minister of Finance", name: "Natàlia Mas Guix" }],
  AO: [{ office: "President", name: "João Lourenço" }, { office: "Minister of Finance", name: "Vera Daves de Sousa" }],
  AG: [{ office: "Prime Minister", name: "Gaston Browne" }, { office: "Minister of Finance", name: "Gaston Browne" }],
  AR: [{ office: "President", name: "Javier Milei" }, { office: "Vice President", name: "Victoria Villarruel" }, { office: "Minister of Finance", name: "Luis Caputo" }],
  AM: [{ office: "Prime Minister", name: "Nikol Pashinyan" }, { office: "Minister of Finance", name: "Vahe Hovhannisyan" }],
  AU: [{ office: "King", name: "Charles III" }, { office: "Prime Minister", name: "Anthony Albanese" }, { office: "Treasurer", name: "Jim Chalmers" }],
  AT: [{ office: "President", name: "Alexander Van der Bellen" }, { office: "Chancellor", name: "Herbert Kickl" }, { office: "Minister of Finance", name: "Markus Marterbauer" }],
  AZ: [{ office: "President", name: "Ilham Aliyev" }, { office: "Prime Minister", name: "Ali Asadov" }, { office: "Minister of Finance", name: "Samir Sharifov" }],
  BS: [{ office: "Prime Minister", name: "Philip Davis" }, { office: "Minister of Finance", name: "Philip Davis" }],
  BH: [{ office: "King", name: "Hamad bin Isa Al Khalifa" }, { office: "Prime Minister", name: "Salman bin Hamad Al Khalifa" }, { office: "Minister of Finance", name: "Salman bin Khalifa Al Khalifa" }],
  BD: [{ office: "Chief Adviser", name: "Muhammad Yunus" }, { office: "Finance Adviser", name: "Salehuddin Ahmed" }],
  BB: [{ office: "Prime Minister", name: "Mia Mottley" }, { office: "Minister of Finance", name: "Mia Mottley" }],
  BY: [{ office: "President", name: "Alexander Lukashenko" }, { office: "Prime Minister", name: "Roman Golovchenko" }, { office: "Minister of Finance", name: "Yuri Seliverstov" }],
  BE: [{ office: "Prime Minister", name: "Alexander De Croo" }, { office: "Finance Minister", name: "Vincent Van Peteghem" }],
  BZ: [{ office: "Prime Minister", name: "John Briceño" }, { office: "Minister of Finance", name: "John Briceño" }],
  BJ: [{ office: "President", name: "Patrice Talon" }, { office: "Minister of Finance", name: "Romuald Wadagni" }],
  BT: [{ office: "Prime Minister", name: "Tshering Tobgay" }, { office: "Minister of Finance", name: "Lekey Dorji" }],
  BO: [{ office: "President", name: "Luis Arce" }, { office: "Vice President", name: "David Choquehuanca" }, { office: "Minister of Finance", name: "Marcelo Montenegro" }],
  BA: [{ office: "Chair of Presidency", name: "Denis Bećirović" }, { office: "Minister of Finance", name: "Srđan Amidžić" }],
  BW: [{ office: "President", name: "Duma Boko" }, { office: "Minister of Finance", name: "Ndaba Gaolathe" }],
  BR: [{ office: "President", name: "Luiz Inácio Lula da Silva" }, { office: "Vice President", name: "Geraldo Alckmin" }, { office: "Minister of Finance", name: "Fernando Haddad" }],
  BN: [{ office: "Sultan & Prime Minister", name: "Hassanal Bolkiah" }, { office: "Minister of Finance", name: "Ismail bin Bakar" }],
  BG: [{ office: "Prime Minister", name: "Rosen Zhelyazkov" }, { office: "Minister of Finance", name: "Temenuzhka Petkova" }],
  BF: [{ office: "President of the Transition", name: "Ibrahim Traoré" }, { office: "Minister of Finance", name: "Aboubakar Nacanabo" }],
  BI: [{ office: "President", name: "Évariste Ndayishimiye" }, { office: "Prime Minister", name: "Gervais Ndirakobuca" }, { office: "Minister of Finance", name: "Audace Niyonzima" }],
  CV: [{ office: "Prime Minister", name: "José Maria Neves" }, { office: "Minister of Finance", name: "Olavo Correia" }],
  KH: [{ office: "Prime Minister", name: "Hun Manet" }, { office: "Minister of Finance", name: "Aun Pornmoniroth" }],
  CM: [{ office: "President", name: "Paul Biya" }, { office: "Prime Minister", name: "Joseph Dion Ngute" }, { office: "Minister of Finance", name: "Louis Paul Motaze" }],
  CA: [{ office: "Prime Minister", name: "Mark Carney" }, { office: "Minister of Finance", name: "François-Philippe Champagne" }],
  CF: [{ office: "President", name: "Faustin-Archange Touadéra" }, { office: "Prime Minister", name: "Félix Moloua" }],
  TD: [{ office: "President", name: "Mahamat Idriss Déby" }, { office: "Prime Minister", name: "Allamaye Halina" }],
  CL: [{ office: "President", name: "Gabriel Boric" }, { office: "Minister of Finance", name: "Mario Marcel" }],
  CN: [{ office: "President", name: "Xi Jinping" }, { office: "Premier", name: "Li Qiang" }, { office: "Minister of Finance", name: "Lan Fo'an" }],
  CO: [{ office: "President", name: "Gustavo Petro" }, { office: "Vice President", name: "Francia Márquez" }, { office: "Minister of Finance", name: "Diego Guevara" }],
  KM: [{ office: "President", name: "Azali Assoumani" }, { office: "Minister of Finance", name: "Moindjie Mzé Ibrahim" }],
  CD: [{ office: "President", name: "Félix Tshisekedi" }, { office: "Prime Minister", name: "Jean-Michel Sama Lukonde" }, { office: "Minister of Finance", name: "Nicolas Kazadi" }],
  CG: [{ office: "President", name: "Denis Sassou Nguesso" }, { office: "Minister of Finance", name: "Jean-Baptiste Ondaye" }],
  CR: [{ office: "President", name: "Rodrigo Chaves Robles" }, { office: "Minister of Finance", name: "Nogui Acosta Jaén" }],
  CI: [{ office: "President", name: "Alassane Ouattara" }, { office: "Prime Minister", name: "Robert Beugré Mambé" }, { office: "Minister of Finance", name: "Adama Coulibaly" }],
  HR: [{ office: "Prime Minister", name: "Andrej Plenković" }, { office: "Minister of Finance", name: "Marko Primorac" }],
  CU: [{ office: "President", name: "Miguel Díaz-Canel" }, { office: "Prime Minister", name: "Manuel Marrero Cruz" }, { office: "Minister of Finance", name: "Vladimir Regueiro Ale" }],
  CY: [{ office: "President", name: "Nikos Christodoulides" }, { office: "Minister of Finance", name: "Makis Keravnos" }],
  CZ: [{ office: "Prime Minister", name: "Petr Fiala" }, { office: "Minister of Finance", name: "Zbyněk Stanjura" }],
  DK: [{ office: "Prime Minister", name: "Mette Frederiksen" }, { office: "Minister of Finance", name: "Nicolai Wammen" }],
  DJ: [{ office: "President", name: "Ismail Omar Guelleh" }, { office: "Prime Minister", name: "Ali Hassan Bahdon" }],
  DM: [{ office: "Prime Minister", name: "Roosevelt Skerrit" }, { office: "Minister of Finance", name: "Irving McIntyre" }],
  DO: [{ office: "President", name: "Luis Abinader" }, { office: "Vice President", name: "Raquel Peña" }, { office: "Minister of Finance", name: "Jochi Vicente" }],
  EC: [{ office: "President", name: "Daniel Noboa" }, { office: "Vice President", name: "Verónica Abad" }, { office: "Minister of Finance", name: "Juan Carlos Vega" }],
  EG: [{ office: "President", name: "Abdel Fattah el-Sisi" }, { office: "Prime Minister", name: "Mostafa Madbouly" }, { office: "Minister of Finance", name: "Ahmed Kouchouk" }],
  SV: [{ office: "President", name: "Nayib Bukele" }, { office: "Vice President", name: "Félix Ulloa" }, { office: "Minister of Finance", name: "Jerson Posada" }],
  GQ: [{ office: "President", name: "Teodoro Obiang Nguema Mbasogo" }, { office: "Prime Minister", name: "Manuela Roka Botey" }],
  ER: [{ office: "President", name: "Isaias Afwerki" }],
  EE: [{ office: "Prime Minister", name: "Kristen Michal" }, { office: "Minister of Finance", name: "Jürgen Ligi" }],
  SZ: [{ office: "King", name: "Mswati III" }, { office: "Prime Minister", name: "Russell Mmiso Dlamini" }],
  ET: [{ office: "Prime Minister", name: "Abiy Ahmed" }, { office: "Minister of Finance", name: "Ahmed Shide" }],
  FJ: [{ office: "Prime Minister", name: "Sitiveni Rabuka" }, { office: "Minister of Finance", name: "Biman Prasad" }],
  FI: [{ office: "Prime Minister", name: "Petteri Orpo" }, { office: "Minister of Finance", name: "Riikka Purra" }],
  FR: [{ office: "President", name: "Emmanuel Macron" }, { office: "Prime Minister", name: "François Bayrou" }, { office: "Minister of Finance", name: "Éric Lombard" }],
  GA: [{ office: "President of the Transition", name: "Brice Clotaire Oligui Nguema" }, { office: "Prime Minister", name: "Raymond Ndong Sima" }],
  GM: [{ office: "President", name: "Adama Barrow" }, { office: "Minister of Finance", name: "Seedy Keita" }],
  GE: [{ office: "Prime Minister", name: "Irakli Kobakhidze" }, { office: "Minister of Finance", name: "Lasha Khutsishvili" }],
  DE: [{ office: "President", name: "Frank-Walter Steinmeier" }, { office: "Chancellor", name: "Friedrich Merz" }, { office: "Minister of Finance", name: "Lars Klingbeil" }],
  GH: [{ office: "President", name: "John Dramani Mahama" }, { office: "Vice President", name: "Jane Naana Opoku Agyemang" }, { office: "Minister of Finance", name: "Cassiel Ato Forson" }],
  GR: [{ office: "Prime Minister", name: "Kyriakos Mitsotakis" }, { office: "Minister of Finance", name: "Kostis Hatzidakis" }],
  GD: [{ office: "Prime Minister", name: "Dickon Mitchell" }, { office: "Minister of Finance", name: "Dennis Cornwall" }],
  GT: [{ office: "President", name: "Bernardo Arévalo" }, { office: "Vice President", name: "Karin Herrera" }, { office: "Minister of Finance", name: "Jonathan Menkos Zeissig" }],
  GN: [{ office: "President of the Transition", name: "Mamadi Doumbouya" }, { office: "Prime Minister", name: "Mamadou Oury Baह" }],
  GW: [{ office: "President", name: "Umaro Sissoco Embaló" }, { office: "Prime Minister", name: "Rui Duarte de Barros" }],
  GY: [{ office: "President", name: "Irfaan Ali" }, { office: "Prime Minister", name: "Mark Phillips" }, { office: "Minister of Finance", name: "Ashni Singh" }],
  HT: [{ office: "Prime Minister", name: "Garry Conille" }],
  HN: [{ office: "President", name: "Xiomara Castro" }, { office: "Minister of Finance", name: "Rixi Moncada" }],
  HU: [{ office: "Prime Minister", name: "Viktor Orbán" }, { office: "Minister of Finance", name: "Mihály Varga" }],
  IS: [{ office: "Prime Minister", name: "Kristrún Frostadóttir" }, { office: "Minister of Finance", name: "Sigurður Ingi Jóhannsson" }],
  IN: [{ office: "President", name: "Droupadi Murmu" }, { office: "Prime Minister", name: "Narendra Modi" }, { office: "Finance Minister", name: "Nirmala Sitharaman" }],
  ID: [{ office: "President", name: "Prabowo Subianto" }, { office: "Vice President", name: "Gibran Rakabuming Raka" }, { office: "Minister of Finance", name: "Sri Mulyani Indrawati" }],
  IR: [{ office: "Supreme Leader", name: "Ali Khamenei" }, { office: "President", name: "Masoud Pezeshkian" }, { office: "Minister of Finance", name: "Abdolnaser Hemmati" }],
  IQ: [{ office: "Prime Minister", name: "Mohammed Shia' Al-Sudani" }, { office: "Minister of Finance", name: "Taif Sami Mohammed" }],
  IE: [{ office: "Taoiseach", name: "Micheál Martin" }, { office: "Minister for Finance", name: "Paschal Donohoe" }],
  IL: [{ office: "Prime Minister", name: "Benjamin Netanyahu" }, { office: "Minister of Finance", name: "Bezalel Smotrich" }],
  IT: [{ office: "President", name: "Sergio Mattarella" }, { office: "Prime Minister", name: "Giorgia Meloni" }, { office: "Minister of Finance", name: "Giancarlo Giorgetti" }],
  JM: [{ office: "Prime Minister", name: "Andrew Holness" }, { office: "Minister of Finance", name: "Nigel Clarke" }],
  JP: [{ office: "Emperor", name: "Naruhito" }, { office: "Prime Minister", name: "Shigeru Ishiba" }, { office: "Minister of Finance", name: "Katsunobu Kato" }],
  JO: [{ office: "King", name: "Abdullah II of Jordan" }, { office: "Prime Minister", name: "Jafar Hassan" }, { office: "Minister of Finance", name: "Mohamad Al-Ississ" }],
  KZ: [{ office: "President", name: "Kassym-Jomart Tokayev" }, { office: "Prime Minister", name: "Olzhas Bektenov" }, { office: "Minister of Finance", name: "Madi Takiyev" }],
  KE: [{ office: "President", name: "William Ruto" }, { office: "Deputy President", name: "Kithure Kindiki" }, { office: "Minister of Finance", name: "John Mbadi" }],
  KI: [{ office: "President", name: "Taneti Maamau" }],
  KP: [{ office: "Supreme Leader", name: "Kim Jong-un" }, { office: "Premier", name: "Kim Tok-hun" }],
  KR: [{ office: "President", name: "Yoon Suk-yeol" }, { office: "Prime Minister", name: "Han Duck-soo" }, { office: "Minister of Finance", name: "Choi Sang-mok" }],
  KW: [{ office: "Emir", name: "Mishal Al-Ahmad Al-Jaber Al-Sabah" }, { office: "Prime Minister", name: "Ahmad Al-Abdullah Al-Sabah" }, { office: "Minister of Finance", name: "Noura Al-Fassam" }],
  KG: [{ office: "President", name: "Sadyr Japarov" }, { office: "Chairman of Cabinet", name: "Adylbek Kasymaliev" }, { office: "Minister of Finance", name: "Almaz Baketayev" }],
  LA: [{ office: "President", name: "Thongloun Sisoulith" }, { office: "Prime Minister", name: "Sonexay Siphandon" }, { office: "Minister of Finance", name: "Bounchom Ubonpaseuth" }],
  LV: [{ office: "Prime Minister", name: "Evika Siliņa" }, { office: "Minister of Finance", name: "Arvils Ašeradens" }],
  LB: [{ office: "President", name: "Joseph Aoun" }, { office: "Prime Minister", name: "Nawaf Salam" }, { office: "Minister of Finance", name: "Yassine Jaber" }],
  LS: [{ office: "Prime Minister", name: "Ntsokoane Matekane" }, { office: "Minister of Finance", name: "Retšelisitsoe Matlosa" }],
  LR: [{ office: "President", name: "Joseph Boakai" }, { office: "Vice President", name: "Jeremiah Koung" }, { office: "Minister of Finance", name: "Augustine Ngafuan" }],
  LY: [{ office: "Prime Minister (GNU)", name: "Abdul Hamid Dbeibeh" }],
  LI: [{ office: "Prime Minister", name: "Daniel Risch" }, { office: "Minister of Finance", name: "Daniel Risch" }],
  LT: [{ office: "Prime Minister", name: "Gintautas Paluckas" }, { office: "Minister of Finance", name: "Rimantas Šadžius" }],
  LU: [{ office: "Prime Minister", name: "Luc Frieden" }, { office: "Minister of Finance", name: "Gilles Roth" }],
  MG: [{ office: "President", name: "Andry Rajoelina" }, { office: "Prime Minister", name: "Christian Ntsay" }, { office: "Minister of Finance", name: "Rindra Hasimbelo Rabarinirinarison" }],
  MW: [{ office: "President", name: "Lazarus Chakwera" }, { office: "Vice President", name: "Saulos Chilima" }, { office: "Minister of Finance", name: "Simplex Chithyola Banda" }],
  MY: [{ office: "Prime Minister", name: "Anwar Ibrahim" }, { office: "Minister of Finance", name: "Anwar Ibrahim" }],
  MV: [{ office: "President", name: "Mohamed Muizzu" }, { office: "Minister of Finance", name: "Moosa Zameer" }],
  ML: [{ office: "President of the Transition", name: "Assimi Goïta" }, { office: "Prime Minister", name: "Abdoulaye Maïga" }],
  MT: [{ office: "Prime Minister", name: "Robert Abela" }, { office: "Minister of Finance", name: "Clyde Caruana" }],
  MH: [{ office: "President", name: "Hilda Heine" }],
  MR: [{ office: "President", name: "Mohamed Ould Ghazouani" }, { office: "Prime Minister", name: "Mokhtar Ould Djay" }, { office: "Minister of Finance", name: "Oumar Mamadou Baldé" }],
  MU: [{ office: "Prime Minister", name: "Navin Ramgoolam" }, { office: "Minister of Finance", name: "Renganaden Padayachy" }],
  MX: [{ office: "President", name: "Claudia Sheinbaum" }, { office: "Minister of Finance", name: "Rogelio Ramírez de la O" }],
  FM: [{ office: "President", name: "Wesley Simina" }],
  MD: [{ office: "President", name: "Maia Sandu" }, { office: "Prime Minister", name: "Ion Ceban" }, { office: "Minister of Finance", name: "Natalia Gavrilița" }],
  MC: [{ office: "Minister of State", name: "Didier Guillaume" }, { office: "Minister of Finance", name: "Jean-Luc Brossard" }],
  MN: [{ office: "Prime Minister", name: "Oyun-Erdene Luvsannamsrai" }, { office: "Minister of Finance", name: "Bolormaa Lkhagvajav" }],
  ME: [{ office: "Prime Minister", name: "Milojko Spajić" }, { office: "Minister of Finance", name: "Novica Vuković" }],
  MA: [{ office: "King", name: "Mohammed VI of Morocco" }, { office: "Prime Minister", name: "Aziz Akhannouch" }, { office: "Minister of Finance", name: "Nadia Fettah Alaoui" }],
  MZ: [{ office: "President", name: "Daniel Chapo" }, { office: "Prime Minister", name: "Maria Benvinda Levi" }, { office: "Minister of Finance", name: "Carla Louveira" }],
  MM: [{ office: "Senior General", name: "Min Aung Hlaing" }],
  NA: [{ office: "President", name: "Netumbo Nandi-Ndaitwah" }, { office: "Vice President", name: "Lucia Witbooi" }, { office: "Minister of Finance", name: "Ericah Shafudah" }],
  NR: [{ office: "President", name: "David Adeang" }],
  NP: [{ office: "Prime Minister", name: "KP Sharma Oli" }, { office: "Finance Minister", name: "Bishnu Paudel" }],
  NL: [{ office: "Prime Minister", name: "Dick Schoof" }, { office: "Minister of Finance", name: "Eelco Heinen" }],
  NZ: [{ office: "Prime Minister", name: "Christopher Luxon" }, { office: "Minister of Finance", name: "Nicola Willis" }],
  NI: [{ office: "President", name: "Daniel Ortega" }, { office: "Vice President", name: "Rosario Murillo" }, { office: "Minister of Finance", name: "Iván Acosta Montalván" }],
  NE: [{ office: "President of the National Council", name: "Abdourahamane Tchiani" }, { office: "Prime Minister", name: "Ali Mahaman Lamine Zeine" }],
  NG: [{ office: "President", name: "Bola Tinubu" }, { office: "Vice President", name: "Kashim Shettima" }, { office: "Minister of Finance", name: "Wale Edun" }],
  MK: [{ office: "President", name: "Gordana Siljanovska-Davkova" }, { office: "Prime Minister", name: "Hristijan Mickoski" }, { office: "Minister of Finance", name: "Gordana Dimitrieska Kocoska" }],
  NO: [{ office: "King", name: "Harald V of Norway" }, { office: "Prime Minister", name: "Jonas Gahr Støre" }, { office: "Minister of Finance", name: "Trygve Slagsvold Vedum" }],
  OM: [{ office: "Sultan & Prime Minister", name: "Haitham bin Tariq" }, { office: "Minister of Finance", name: "Sultan bin Salim Al Habsi" }],
  PK: [{ office: "Prime Minister", name: "Shehbaz Sharif" }, { office: "Minister of Finance", name: "Muhammad Aurangzeb" }],
  PW: [{ office: "President", name: "Surangel Whipps Jr" }],
  PA: [{ office: "President", name: "José Raúl Mulino" }, { office: "Vice President", name: "José Gabriel Carrizo" }, { office: "Minister of Finance", name: "Felipe Chapman" }],
  PG: [{ office: "Prime Minister", name: "James Marape" }, { office: "Minister of Finance", name: "Ian Ling-Stuckey" }],
  PY: [{ office: "President", name: "Santiago Peña" }, { office: "Vice President", name: "Pedro Alliana" }, { office: "Minister of Finance", name: "Carlos Fernández Valdovinos" }],
  PE: [{ office: "President", name: "Dina Boluarte" }, { office: "Prime Minister", name: "Gustavo Adrianzén" }, { office: "Minister of Finance", name: "José Arista Arbildo" }],
  PH: [{ office: "President", name: "Ferdinand Marcos Jr" }, { office: "Vice President", name: "Sara Duterte" }, { office: "Secretary of Finance", name: "Ralph Recto" }],
  PL: [{ office: "Prime Minister", name: "Donald Tusk" }, { office: "Minister of Finance", name: "Andrzej Domański" }],
  PT: [{ office: "Prime Minister", name: "Luís Montenegro" }, { office: "Minister of Finance", name: "Joaquim Miranda Sarmento" }],
  QA: [{ office: "Emir", name: "Tamim bin Hamad Al Thani" }, { office: "Prime Minister", name: "Mohammed bin Abdulrahman Al Thani" }, { office: "Minister of Finance", name: "Ali bin Ahmed Al Kuwari" }],
  RO: [{ office: "President", name: "Călin Georgescu" }, { office: "Prime Minister", name: "Marcel Ciolacu" }, { office: "Minister of Finance", name: "Marcel Boloș" }],
  RU: [{ office: "President", name: "Vladimir Putin" }, { office: "Prime Minister", name: "Mikhail Mishustin" }, { office: "Minister of Finance", name: "Anton Siluanov" }],
  RW: [{ office: "President", name: "Paul Kagame" }, { office: "Prime Minister", name: "Édouard Ngirente" }, { office: "Minister of Finance", name: "Yusuf Murangwa" }],
  KN: [{ office: "Prime Minister", name: "Terrance Drew" }, { office: "Minister of Finance", name: "Terrance Drew" }],
  LC: [{ office: "Prime Minister", name: "Philip Pierre" }, { office: "Minister of Finance", name: "Philip Pierre" }],
  VC: [{ office: "Prime Minister", name: "Ralph Gonsalves" }, { office: "Minister of Finance", name: "Camillo Gonsalves" }],
  WS: [{ office: "Prime Minister", name: "Fiamē Naomi Mataʻafa" }, { office: "Minister of Finance", name: "Mulipola Anarosa Ale Molio'o" }],
  SM: [{ office: "Captain Regent", name: "Alessandro Rossi" }, { office: "Secretary of Finance", name: "Marco Gatti" }],
  ST: [{ office: "Prime Minister", name: "Américo Ramos" }, { office: "Minister of Finance", name: "Américo Ramos" }],
  SA: [{ office: "King", name: "Salman bin Abdulaziz Al Saud" }, { office: "Prime Minister", name: "Mohammed bin Salman" }, { office: "Minister of Finance", name: "Mohammed Al-Jadaan" }],
  SN: [{ office: "President", name: "Bassirou Diomaye Faye" }, { office: "Prime Minister", name: "Ousmane Sonko" }, { office: "Minister of Finance", name: "Cheikh Diba" }],
  RS: [{ office: "President", name: "Aleksandar Vučić" }, { office: "Prime Minister", name: "Miloš Vučević" }, { office: "Minister of Finance", name: "Siniša Mali" }],
  SC: [{ office: "President", name: "Wavel Ramkalawan" }, { office: "Minister of Finance", name: "Naadir Hassan" }],
  SL: [{ office: "President", name: "Julius Maada Bio" }, { office: "Vice President", name: "Mohamed Juldeh Jalloh" }, { office: "Minister of Finance", name: "Sheku Fantamadi Bangura" }],
  SG: [{ office: "Prime Minister", name: "Lawrence Wong" }, { office: "Deputy Prime Minister & Finance Minister", name: "Gan Kim Yong" }],
  SK: [{ office: "Prime Minister", name: "Robert Fico" }, { office: "Minister of Finance", name: "Ladislav Kamenický" }],
  SI: [{ office: "Prime Minister", name: "Robert Golob" }, { office: "Minister of Finance", name: "Klemen Boštjančič" }],
  SB: [{ office: "Prime Minister", name: "Jeremiah Manele" }, { office: "Minister of Finance", name: "Harry Kuma" }],
  SO: [{ office: "President", name: "Hassan Sheikh Mohamud" }, { office: "Prime Minister", name: "Hamza Abdi Barre" }, { office: "Minister of Finance", name: "Bihi Iman Egeh" }],
  ZA: [{ office: "President", name: "Cyril Ramaphosa" }, { office: "Deputy President", name: "Paul Mashatile" }, { office: "Minister of Finance", name: "Enoch Godongwana" }],
  SS: [{ office: "President", name: "Salva Kiir Mayardit" }, { office: "First Vice President", name: "Riek Machar" }, { office: "Minister of Finance", name: "Athian Diing Athian" }],
  ES: [{ office: "Prime Minister", name: "Pedro Sánchez" }, { office: "Minister of Finance", name: "María Jesús Montero" }],
  LK: [{ office: "President", name: "Anura Kumara Dissanayake" }, { office: "Prime Minister", name: "Harini Amarasuriya" }, { office: "Minister of Finance", name: "Anura Kumara Dissanayake" }],
  SD: [{ office: "Chair, Sovereignty Council", name: "Abdel Fattah al-Burhan" }],
  SR: [{ office: "President", name: "Chan Santokhi" }, { office: "Vice President", name: "Ronnie Brunswijk" }, { office: "Minister of Finance", name: "Stanley Raghoebarsing" }],
  SE: [{ office: "Prime Minister", name: "Ulf Kristersson" }, { office: "Minister of Finance", name: "Elisabeth Svantesson" }],
  CH: [{ office: "President of the Federal Council", name: "Karin Keller-Sutter" }, { office: "Head of Finance Department", name: "Karin Keller-Sutter" }],
  SY: [{ office: "President (Interim)", name: "Ahmad al-Sharaa" }, { office: "Prime Minister", name: "Mohammad al-Bashir" }],
  TW: [{ office: "President", name: "Lai Ching-te" }, { office: "Premier", name: "Cho Jung-tai" }, { office: "Minister of Finance", name: "Chuang Tsui-yun" }],
  TJ: [{ office: "President", name: "Emomali Rahmon" }, { office: "Prime Minister", name: "Kokhir Rasulzoda" }, { office: "Minister of Finance", name: "Farrukh Kasimov" }],
  TZ: [{ office: "President", name: "Samia Suluhu Hassan" }, { office: "Vice President", name: "Philip Mpango" }, { office: "Minister of Finance", name: "Mwigulu Nchemba" }],
  TH: [{ office: "Prime Minister", name: "Paetongtarn Shinawatra" }, { office: "Minister of Finance", name: "Pichai Chunhavajira" }],
  TL: [{ office: "President", name: "José Ramos-Horta" }, { office: "Prime Minister", name: "Kay Rala Xanana Gusmão" }, { office: "Minister of Finance", name: "Rui Gomes" }],
  TG: [{ office: "President", name: "Faure Gnassingbé" }, { office: "Prime Minister", name: "Victoire Dogbé" }, { office: "Minister of Finance", name: "Sani Yaya" }],
  TO: [{ office: "Prime Minister", name: "Siaosi Sovaleni" }, { office: "Minister of Finance", name: "Tiofilusi Tiueti" }],
  TT: [{ office: "Prime Minister", name: "Keith Rowley" }, { office: "Minister of Finance", name: "Colm Imbert" }],
  TN: [{ office: "President", name: "Kais Saied" }, { office: "Prime Minister", name: "Kamel Maddouri" }, { office: "Minister of Finance", name: "Sihem Boughdiri Nemsia" }],
  TR: [{ office: "President", name: "Recep Tayyip Erdoğan" }, { office: "Vice President", name: "Cevdet Yılmaz" }, { office: "Minister of Finance", name: "Mehmet Şimşek" }],
  TM: [{ office: "President", name: "Serdar Berdimuhamedow" }, { office: "Deputy PM for Finance", name: "Muhammetgeldi Serdarov" }],
  TV: [{ office: "Prime Minister", name: "Feleti Teo" }, { office: "Minister of Finance", name: "Seve Paeniu" }],
  UG: [{ office: "President", name: "Yoweri Museveni" }, { office: "Vice President", name: "Jessica Alupo" }, { office: "Minister of Finance", name: "Matia Kasaija" }],
  UA: [{ office: "President", name: "Volodymyr Zelensky" }, { office: "Prime Minister", name: "Denys Shmyhal" }, { office: "Minister of Finance", name: "Serhiy Marchenko" }],
  AE: [{ office: "President", name: "Mohamed bin Zayed Al Nahyan" }, { office: "Prime Minister", name: "Mohammed bin Rashid Al Maktoum" }, { office: "Minister of Finance", name: "Mohammed Al Jadaan" }],
  GB: [{ office: "King", name: "Charles III" }, { office: "Prime Minister", name: "Keir Starmer" }, { office: "Chancellor of the Exchequer", name: "Rachel Reeves" }],
  US: [{ office: "President", name: "Donald Trump" }, { office: "Vice President", name: "JD Vance" }, { office: "Secretary of the Treasury", name: "Scott Bessent" }],
  UY: [{ office: "President", name: "Yamandú Orsi" }, { office: "Vice President", name: "Carolina Cosse" }, { office: "Minister of Finance", name: "Gabriel Oddone" }],
  UZ: [{ office: "President", name: "Shavkat Mirziyoyev" }, { office: "Prime Minister", name: "Abdulla Aripov" }, { office: "Minister of Finance", name: "Jamshid Kuchkarov" }],
  VU: [{ office: "Prime Minister", name: "Charlot Salwai" }, { office: "Minister of Finance", name: "Jotham Napat" }],
  VE: [{ office: "President", name: "Nicolás Maduro" }, { office: "Vice President", name: "Delcy Rodríguez" }, { office: "Minister of Finance", name: "Simón Zerpa Delgado" }],
  VN: [{ office: "General Secretary", name: "Tô Lâm" }, { office: "President", name: "Lương Cường" }, { office: "Prime Minister", name: "Phạm Minh Chính" }, { office: "Minister of Finance", name: "Nguyễn Văn Thắng" }],
  YE: [{ office: "President (PLC)", name: "Rashad al-Alimi" }, { office: "Prime Minister", name: "Ahmad Awad bin Mubarak" }],
  ZM: [{ office: "President", name: "Hakainde Hichilema" }, { office: "Vice President", name: "W.K. Mutale Nalumango" }, { office: "Minister of Finance", name: "Situmbeko Musokotwane" }],
  ZW: [{ office: "President", name: "Emmerson Mnangagwa" }, { office: "Vice President", name: "Constantino Chiwenga" }, { office: "Minister of Finance", name: "Mthuli Ncube" }],
};

function allocateSlug(name, office, iso, reserved) {
  const base = `${slugifyName(name)}-${slugifyName(office).slice(0, 20)}-${iso.toLowerCase()}`
    .replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  let slug = base, n = 2;
  while (reserved.has(slug)) slug = `${base}-${n++}`;
  reserved.add(slug);
  return slug;
}

const BAD_NAME = /^(Q\d+|https?:\/\/)/i;
const STALE_NAMES = ["William Pitt the Younger", "William Pitt", "Tito Mboweni", "Mangala Samaraweera", "Tadeusz Kościński", "Bola Ahmed Tinubu"];

function isBadEntry(p) {
  const name = String(p.profile?.name || "");
  if (BAD_NAME.test(name)) return true;
  if (STALE_NAMES.some(s => name === s)) return true;
  return false;
}

function main() {
  const files = fs.readdirSync(POLITICIANS_DIR).filter(f => f.endsWith(".json"));
  const globalReserved = new Set();
  // Pre-populate reserved slugs from all clean entries
  for (const file of files) {
    const d = JSON.parse(fs.readFileSync(path.join(POLITICIANS_DIR, file), "utf8"));
    for (const p of d.politicians || []) if (p.profile?.slug && !isBadEntry(p)) globalReserved.add(p.profile.slug);
  }

  let added = 0, cleaned = 0, countriesUpdated = 0;
  const now = new Date().toISOString();

  for (const file of files) {
    const filePath = path.join(POLITICIANS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const countrySlug = data.countrySlug;

    const countryFile = path.join(COUNTRIES_DIR, `${countrySlug}.json`);
    if (!fs.existsSync(countryFile)) continue;
    const country = JSON.parse(fs.readFileSync(countryFile, "utf8"));
    const iso = country.profile?.isoCode;
    const countryName = country.profile?.name;
    if (!iso) continue;

    // 1. Remove bad/stale entries
    const before = (data.politicians || []).length;
    data.politicians = (data.politicians || []).filter(p => !isBadEntry(p));
    cleaned += before - data.politicians.length;

    // 2. Apply static officials — always override existing entries for same office
    const staticOfficials = OFFICIALS[iso] || [];
    for (const o of staticOfficials) {
      // Remove existing entry for this office (will be replaced with correct data)
      const existingIdx = (data.politicians || []).findIndex(
        p => (p.office || p.profile?.office || "").toLowerCase() === o.office.toLowerCase()
      );
      if (existingIdx !== -1) {
        if (data.politicians[existingIdx].profile?.name === o.name) continue; // already correct
        const oldSlug = data.politicians[existingIdx].profile?.slug;
        if (oldSlug) globalReserved.delete(oldSlug);
        data.politicians.splice(existingIdx, 1);
      }

      const slug = allocateSlug(o.name, o.office, iso, globalReserved);
      data.politicians.push({
        office: o.office,
        profile: {
          id: slug, slug,
          name: o.name, countrySlug, countryName,
          office: o.office,
          searchTerms: [o.name.toLowerCase(), o.office.toLowerCase(), countryName.toLowerCase(), iso.toLowerCase()],
          dataSources: [{ name: "Curated static data", url: "https://en.wikipedia.org" }],
          lastUpdated: now,
        },
      });
      added++;
    }

    // 3. Dedupe by office — keep last (static) entry wins
    const seenOffice = new Map();
    for (const p of data.politicians) {
      const key = (p.office || p.profile?.office || "").toLowerCase();
      seenOffice.set(key, p);
    }
    data.politicians = [...seenOffice.values()];

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    countriesUpdated++;
  }

  console.log(`Cleaned ${cleaned} bad entries. Applied ${added} static officials across ${countriesUpdated} countries.`);
  console.log("Run: npm run db:seed-politicians");
}

main();
