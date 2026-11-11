// Bilingual text tuple: [Türkçe, English]
export type T = [string, string];
export type Cat = 'proton' | 'production' | 'decel' | 'exp' | 'trap';

export interface Part {
  id: string;
  cat: Cat;
  pos: [number, number]; // x, z in scene units
  h: number; // label height
  r: number; // footprint radius (selection halo)
  view: number; // camera distance when focused
  lo?: [number, number]; // label offset x, z
  name: T;
  short: T;
  desc: T;
  fact: T;
  specs: [T, T][];
}

export const CATS: Record<Cat, { name: T; color: string }> = {
  proton: { name: ['Proton hızlandırma', 'Proton acceleration'], color: '#4cc9f0' },
  production: { name: ['Antiproton üretimi', 'Antiproton production'], color: '#ffb547' },
  decel: { name: ['Yavaşlatma ve soğutma', 'Deceleration & cooling'], color: '#ff4d9d' },
  exp: { name: ['Deneyler', 'Experiments'], color: '#a78bfa' },
  trap: { name: ['Tuzak laboratuvarı (yakın plan)', 'Trap lab (close-up)'], color: '#b8f35a' },
};

export const PARTS: Part[] = [
  {
    id: 'source', cat: 'proton', pos: [-69, -29], h: 4.6, r: 3.6, view: 17,
    name: ['Hidrojen Kaynağı', 'Hydrogen Source'],
    short: ['Her şey bir şişe hidrojenle başlar', 'It all starts with a bottle of hydrogen'],
    desc: [
      'Zincirin ilk halkası sıradan bir hidrojen gazı şişesidir. Gaz bir plazma odasına verilir ve atomlara fazladan bir elektron eklenerek negatif hidrojen iyonları (H⁻) elde edilir. Bu iyonlar elektrik alanıyla çekilip Linac4’e gönderilir.',
      'The first link in the chain is an ordinary bottle of hydrogen gas. The gas is fed into a plasma chamber where atoms pick up an extra electron and become negative hydrogen ions (H⁻). An electric field pulls these ions out and sends them into Linac4.',
    ],
    fact: [
      'CERN’in bütün hızlandırıcı kompleksi yılda yalnızca birkaç miligram hidrojen tüketir.',
      'The whole CERN accelerator complex uses only a few milligrams of hydrogen per year.',
    ],
    specs: [
      [['Parçacık', 'Particle'], ['H⁻ iyonu', 'H⁻ ion']],
      [['Çıkış enerjisi', 'Output energy'], ['45 keV', '45 keV']],
      [['Hammadde', 'Raw material'], ['Hidrojen gazı', 'Hydrogen gas']],
    ],
  },
  {
    id: 'linac4', cat: 'proton', pos: [-57, -29], h: 3.6, r: 10.5, view: 32,
    name: ['Linac4', 'Linac4'],
    short: ['Doğrusal hızlandırıcı', 'Linear accelerator'],
    desc: [
      'Linac4, iyonları düz bir hat boyunca art arda dizilmiş radyofrekans kovuklarıyla hızlandırır. Her kovuktaki elektrik alanı, iyon demeti tam geçerken onu ileri itecek şekilde salınır. 2020’de eski Linac2’nin yerini almıştır.',
      'Linac4 accelerates the ions along a straight line through a series of radio-frequency cavities. The electric field in each cavity oscillates so that it pushes the ion bunch forward exactly as it passes. It replaced the older Linac2 in 2020.',
    ],
    fact: [
      'İyonlar 86 metrenin sonunda ışık hızının yaklaşık yarısına ulaşır.',
      'By the end of its 86 metres the ions travel at roughly half the speed of light.',
    ],
    specs: [
      [['Uzunluk', 'Length'], ['86 m', '86 m']],
      [['Çıkış enerjisi', 'Output energy'], ['160 MeV', '160 MeV']],
      [['Devreye giriş', 'In service since'], ['2020', '2020']],
    ],
  },
  {
    id: 'psb', cat: 'proton', pos: [-42, -24], h: 5.2, r: 7.2, view: 26,
    name: ['PS Booster', 'PS Booster'],
    short: ['Üst üste dört halka', 'Four stacked rings'],
    desc: [
      'Booster’a girerken H⁻ iyonları ince bir karbon folyodan geçer; iki elektron sıyrılır ve geriye çıplak protonlar kalır. Üst üste yerleştirilmiş dört sinkrotron halkası protonları hızlandırıp tek bir demet halinde PS’ye yollar.',
      'As they enter the Booster, the H⁻ ions pass through a thin carbon foil that strips both electrons, leaving bare protons. Four synchrotron rings stacked on top of each other accelerate the protons and recombine them into one beam for the PS.',
    ],
    fact: [
      'Dört halka kullanmak, tek halkaya sığandan çok daha yoğun bir proton demeti elde etmeyi sağlar.',
      'Using four rings allows a far denser proton beam than a single ring could hold.',
    ],
    specs: [
      [['Çevre', 'Circumference'], ['157 m', '157 m']],
      [['Çıkış enerjisi', 'Output energy'], ['2 GeV', '2 GeV']],
      [['Halka sayısı', 'Rings'], ['4', '4']],
    ],
  },
  {
    id: 'ps', cat: 'proton', pos: [-14, -11], h: 4, r: 20.5, view: 62,
    name: ['Proton Sinkrotronu (PS)', 'Proton Synchrotron (PS)'],
    short: ['Antimaddenin enerji kaynağı', 'The engine behind antimatter'],
    desc: [
      'PS, CERN’in 1959’dan beri çalışan emektar hızlandırıcısıdır. Mıknatıslar protonları dairesel yörüngede tutarken RF kovukları her turda enerji ekler. Antimadde üretimi için protonlar 26 GeV/c momentuma çıkarılır ve hedefe doğru fırlatılır.',
      'The PS is CERN’s veteran accelerator, running since 1959. Magnets keep the protons on a circular orbit while RF cavities add energy on every turn. For antimatter production the protons are brought to a momentum of 26 GeV/c and fired at the target.',
    ],
    fact: [
      'PS, 60 yılı aşkın süredir çalışıyor ve hâlâ LHC dahil birçok deneye demet sağlıyor.',
      'The PS has been running for over 60 years and still feeds many experiments, including the LHC.',
    ],
    specs: [
      [['Çevre', 'Circumference'], ['628 m', '628 m']],
      [['Momentum', 'Momentum'], ['26 GeV/c', '26 GeV/c']],
      [['Mıknatıs', 'Magnets'], ['277 adet', '277']],
    ],
  },
  {
    id: 'target', cat: 'production', pos: [4, 0], h: 4.8, r: 3.8, view: 17,
    name: ['İridyum Hedef', 'Iridium Target'],
    short: ['Enerji maddeye ve antimaddeye dönüşür', 'Energy turns into matter and antimatter'],
    desc: [
      'Proton demeti, grafit içine gömülü ince bir iridyum çubuğa çarpar. Çarpışma enerjisi E = mc² uyarınca yeni parçacıklara dönüşür; bunların arasında proton–antiproton çiftleri de vardır. Hedef, her atımda binlerce derecelik ani ısınmaya dayanmak zorundadır.',
      'The proton beam slams into a thin iridium rod embedded in graphite. The collision energy turns into new particles following E = mc², among them proton–antiproton pairs. The target has to survive a sudden temperature jump of thousands of degrees on every shot.',
    ],
    fact: [
      'Verim çok düşüktür: yüz binlerce protondan yalnızca bir tane kullanılabilir antiproton elde edilir.',
      'The yield is tiny: it takes several hundred thousand protons to get one usable antiproton.',
    ],
    specs: [
      [['Malzeme', 'Material'], ['İridyum', 'Iridium']],
      [['Atım başına proton', 'Protons per shot'], ['≈ 1,5 × 10¹³', '≈ 1.5 × 10¹³']],
      [['Antiproton momentumu', 'Antiproton momentum'], ['3,57 GeV/c', '3.57 GeV/c']],
    ],
  },
  {
    id: 'horn', cat: 'production', pos: [4, 5.5], h: 3.8, r: 2.8, view: 13,
    name: ['Manyetik Boynuz', 'Magnetic Horn'],
    short: ['Dağılan antiprotonları toplar', 'Gathers the spraying antiprotons'],
    desc: [
      'Antiprotonlar hedeften her yöne saçılarak çıkar. Boynuz biçimli bu iletkenden çok kısa süreli dev bir akım geçirilir; oluşan manyetik alan bir mercek gibi davranarak antiprotonları tek bir demete odaklar ve AD halkasına yönlendirir.',
      'Antiprotons leave the target spraying in all directions. A huge, very short current pulse is sent through this horn-shaped conductor; the resulting magnetic field acts like a lens, focusing the antiprotons into a beam headed for the AD ring.',
    ],
    fact: [
      'Boynuzdan geçen akım yaklaşık 400.000 amperdir; bir yıldırımın akımından kat kat fazla.',
      'The current through the horn is about 400,000 amperes, many times that of a lightning bolt.',
    ],
    specs: [
      [['Akım atımı', 'Current pulse'], ['≈ 400 kA', '≈ 400 kA']],
      [['Görev', 'Role'], ['Odaklama', 'Focusing']],
      [['Tür', 'Type'], ['Atımlı mercek', 'Pulsed lens']],
    ],
  },
  {
    id: 'ad', cat: 'decel', pos: [26, 20], h: 4.2, r: 24, view: 76, lo: [15.6, -15.6],
    name: ['Antiproton Yavaşlatıcı (AD)', 'Antiproton Decelerator (AD)'],
    short: ['Tersine çalışan hızlandırıcı', 'An accelerator running in reverse'],
    desc: [
      'AD, sıradan hızlandırıcıların tam tersini yapar: antiprotonları yavaşlatır. Hedeften ışık hızına yakın çıkan antiprotonlar halkada dolanırken adım adım frenlenir ve her adımda soğutularak demet sıkı tutulur. Bir çevrim yaklaşık iki dakika sürer.',
      'The AD does the opposite of a normal accelerator: it slows antiprotons down. Emerging from the target near the speed of light, the antiprotons circulate in the ring while being braked step by step, with cooling at each stage to keep the beam tight. One cycle takes about two minutes.',
    ],
    fact: [
      'AD 2000 yılından beri çalışıyor ve dünyada düşük enerjili antiproton sağlayan tek tesistir.',
      'Running since 2000, the AD is the only facility in the world that delivers low-energy antiprotons.',
    ],
    specs: [
      [['Çevre', 'Circumference'], ['182 m', '182 m']],
      [['Giriş → çıkış', 'In → out'], ['3,57 GeV/c → 100 MeV/c', '3.57 GeV/c → 100 MeV/c']],
      [['Çevrim başına', 'Per cycle'], ['≈ 3 × 10⁷ antiproton', '≈ 3 × 10⁷ antiprotons']],
    ],
  },
  {
    id: 'stoch', cat: 'decel', pos: [26, -2], h: 4.6, r: 3.6, view: 24,
    name: ['Stokastik Soğutma', 'Stochastic Cooling'],
    short: ['Demeti ölçer ve düzeltir', 'Measures the beam, then corrects it'],
    desc: [
      'Halkanın bir yanındaki algılayıcı, parçacıkların ideal yörüngeden sapmasını ölçer. Sinyal halkanın içinden kestirme bir kabloyla karşıya gönderilir ve parçacıklar oraya vardığında “vurucu” elektrotlar onları geri iter. Milyonlarca turdan sonra demet daralır.',
      'A pickup on one side of the ring measures how far particles stray from the ideal orbit. The signal takes a shortcut by cable across the ring, and when the particles arrive on the other side a “kicker” nudges them back. After millions of turns the beam shrinks.',
    ],
    fact: [
      'Bu yöntemi bulan Simon van der Meer, 1984 Nobel Fizik Ödülü’nü paylaştı.',
      'Its inventor, Simon van der Meer, shared the 1984 Nobel Prize in Physics.',
    ],
    specs: [
      [['Kullanıldığı momentum', 'Used at'], ['3,57 ve 2 GeV/c', '3.57 and 2 GeV/c']],
      [['Bileşenler', 'Components'], ['Algılayıcı + vurucu', 'Pickup + kicker']],
      [['Mucit', 'Inventor'], ['S. van der Meer', 'S. van der Meer']],
    ],
  },
  {
    id: 'ecool', cat: 'decel', pos: [48, 20], h: 6.2, r: 4.2, view: 19,
    name: ['Elektron Soğutucu', 'Electron Cooler'],
    short: ['Soğuk elektronlarla banyo', 'A bath of cold electrons'],
    desc: [
      'Düşük enerjilerde antiprotonlar, aynı hızla ilerleyen “soğuk” bir elektron demetiyle birkaç metre boyunca yan yana yol alır. Çarpışmalarla düzensiz hareketlerini elektronlara aktarırlar; tıpkı sıcak bir gazın soğuk gazla karışınca soğuması gibi.',
      'At low energies the antiprotons travel for a few metres alongside a “cold” electron beam moving at the same speed. Through collisions they hand their random motion over to the electrons, just as a hot gas cools when mixed with a cold one.',
    ],
    fact: [
      'Elektron soğutmayı 1966’da Sovyet fizikçi Gersh Budker önerdi.',
      'Electron cooling was proposed in 1966 by the Soviet physicist Gersh Budker.',
    ],
    specs: [
      [['Kullanıldığı momentum', 'Used at'], ['300 ve 100 MeV/c', '300 and 100 MeV/c']],
      [['Soğutucu ortam', 'Cooling medium'], ['Elektron demeti', 'Electron beam']],
      [['Mucit', 'Inventor'], ['G. Budker', 'G. Budker']],
    ],
  },
  {
    id: 'rf', cat: 'decel', pos: [41.56, 35.56], h: 4.2, r: 3.2, view: 15,
    name: ['RF Kovuğu', 'RF Cavity'],
    short: ['Antiprotonların freni', 'The brake for antiprotons'],
    desc: [
      'Radyofrekans kovuğu içinde hızla salınan bir elektrik alanı bulunur. Hızlandırıcılarda bu alan parçacıkları iter; AD’de ise zamanlaması ters ayarlanır, böylece antiprotonlar her geçişte biraz enerji kaybeder.',
      'An RF cavity contains a rapidly oscillating electric field. In accelerators this field pushes particles forward; in the AD the timing is reversed so that the antiprotons lose a little energy on every pass.',
    ],
    fact: [
      'Antiprotonlar halkadan ayrılırken ışık hızının yaklaşık onda birine kadar yavaşlamıştır.',
      'By the time they leave the ring, the antiprotons are down to about a tenth of the speed of light.',
    ],
    specs: [
      [['Görev', 'Role'], ['Yavaşlatma', 'Deceleration']],
      [['Son enerji', 'Final energy'], ['5,3 MeV', '5.3 MeV']],
      [['İlke', 'Principle'], ['Salınan elektrik alanı', 'Oscillating electric field']],
    ],
  },
  {
    id: 'elena', cat: 'decel', pos: [17, 20], h: 3.6, r: 5.6, view: 21,
    name: ['ELENA', 'ELENA'],
    short: ['Ekstra düşük enerji halkası', 'Extra Low ENergy Antiproton ring'],
    desc: [
      'ELENA, AD’nin içine kurulmuş küçük bir altıgen halkadır. Antiprotonları 50 kat daha yavaşlatır ve kendi elektron soğutucusuyla demeti yoğun tutar. Önceden deneyler antiprotonları folyolarla frenliyor ve %99’undan fazlasını kaybediyordu; ELENA ile çok daha fazlası tuzaklanabiliyor.',
      'ELENA is a small hexagonal ring built inside the AD. It slows the antiprotons a further 50 times and keeps the beam dense with its own electron cooler. Experiments used to brake antiprotons with foils and lose over 99% of them; with ELENA far more can be trapped.',
    ],
    fact: [
      'ELENA, demeti elektrostatik hatlarla aynı anda birden fazla deneye dağıtabilir.',
      'ELENA can deliver beam to several experiments at once through electrostatic lines.',
    ],
    specs: [
      [['Çevre', 'Circumference'], ['30,4 m', '30.4 m']],
      [['Giriş → çıkış', 'In → out'], ['5,3 MeV → 100 keV', '5.3 MeV → 100 keV']],
      [['Biçim', 'Shape'], ['Altıgen', 'Hexagonal']],
    ],
  },
  {
    id: 'alpha', cat: 'exp', pos: [30, 10], h: 8.2, r: 3.4, view: 18,
    name: ['ALPHA', 'ALPHA'],
    short: ['Antihidrojeni tuzaklar ve inceler', 'Traps and studies antihydrogen'],
    desc: [
      'ALPHA, antiprotonlarla pozitronları birleştirip antihidrojen atomları oluşturur ve onları manyetik bir tuzakta tutar. Lazerle antihidrojenin tayfını ölçerek hidrojenle karşılaştırır. Dikey ALPHA-g düzeneği ise antimaddenin yerçekiminde nasıl düştüğünü sınar.',
      'ALPHA combines antiprotons with positrons to make antihydrogen atoms and holds them in a magnetic trap. It measures the spectrum of antihydrogen with lasers and compares it to hydrogen. The vertical ALPHA-g apparatus tests how antimatter falls under gravity.',
    ],
    fact: [
      '2023’te ALPHA-g, antihidrojenin de tıpkı madde gibi aşağı doğru düştüğünü gösterdi.',
      'In 2023 ALPHA-g showed that antihydrogen falls downwards, just like ordinary matter.',
    ],
    specs: [
      [['İlk tuzaklama', 'First trapping'], ['2010', '2010']],
      [['Konu', 'Topic'], ['Tayf ve yerçekimi', 'Spectroscopy & gravity']],
      [['Tutma süresi', 'Holding time'], ['1000 s ve üzeri', '1000 s and more']],
    ],
  },
  {
    id: 'aegis', cat: 'exp', pos: [36, 15], h: 4.6, r: 3.4, view: 17,
    name: ['AEgIS', 'AEgIS'],
    short: ['Antihidrojen demetiyle yerçekimi', 'Gravity with an antihydrogen beam'],
    desc: [
      'AEgIS, lazerle uyarılmış pozitronyumu antiprotonlarla buluşturarak atımlı bir antihidrojen demeti üretir. Amaç, yatay ilerleyen bu demetin yerçekimiyle ne kadar aşağı saptığını çok ince ızgaralarla ölçmektir.',
      'AEgIS produces a pulsed antihydrogen beam by bringing laser-excited positronium together with antiprotons. The goal is to measure, using very fine gratings, how much this horizontal beam sags under gravity.',
    ],
    fact: [
      'Pozitronyum, bir elektron ile bir pozitrondan oluşan ve saniyenin çok küçük bir kesrinde yok olan egzotik bir atomdur.',
      'Positronium is an exotic atom made of an electron and a positron that vanishes in a tiny fraction of a second.',
    ],
    specs: [
      [['Konu', 'Topic'], ['Yerçekimi', 'Gravity']],
      [['Yöntem', 'Method'], ['Atımlı demet', 'Pulsed beam']],
      [['Ölçüm aracı', 'Instrument'], ['Moiré saptırma ölçer', 'Moiré deflectometer']],
    ],
  },
  {
    id: 'base', cat: 'exp', pos: [37, 25], h: 4.6, r: 3.4, view: 17,
    name: ['BASE', 'BASE'],
    short: ['Proton ile antiprotonu kıyaslar', 'Compares proton and antiproton'],
    desc: [
      'BASE, tek tek antiprotonları Penning tuzaklarında aylarca saklar ve özelliklerini olağanüstü hassasiyetle ölçer. Antiprotonun yük/kütle oranını ve manyetik momentini protonunkiyle karşılaştırarak madde ile antimadde arasında en ufak bir fark arar.',
      'BASE stores single antiprotons in Penning traps for months and measures their properties with extraordinary precision. It compares the antiproton’s charge-to-mass ratio and magnetic moment with the proton’s, looking for the slightest difference between matter and antimatter.',
    ],
    fact: [
      'BASE, antiprotonları bir yıldan uzun süre kayıpsız saklamayı başardı.',
      'BASE has kept antiprotons stored for more than a year without losing them.',
    ],
    specs: [
      [['Konu', 'Topic'], ['Hassas kıyaslama', 'Precision comparison']],
      [['Yük/kütle hassasiyeti', 'Charge/mass precision'], ['Trilyonda 16', '16 parts per trillion']],
      [['Araç', 'Tool'], ['Penning tuzakları', 'Penning traps']],
    ],
  },
  {
    id: 'asacusa', cat: 'exp', pos: [30, 31], h: 4.8, r: 3.4, view: 17,
    name: ['ASACUSA', 'ASACUSA'],
    short: ['Antiprotonlu egzotik atomlar', 'Exotic atoms with antiprotons'],
    desc: [
      'ASACUSA, helyum atomundaki bir elektronun yerine antiproton yerleştirerek “antiprotonik helyum” oluşturur ve bunu lazerle inceler. Buradan antiprotonun kütlesi elektronunkine oranla çok hassas biçimde bulunur. Ekip ayrıca antihidrojen demetleri üzerinde çalışır.',
      'ASACUSA makes “antiprotonic helium” by replacing one electron of a helium atom with an antiproton, then probes it with lasers. This yields the antiproton’s mass relative to the electron’s with great precision. The team also works on antihydrogen beams.',
    ],
    fact: [
      'Antiprotonik helyum, madde ve antimaddeyi aynı atomda mikrosaniyeler boyunca bir arada tutar.',
      'Antiprotonic helium keeps matter and antimatter together in one atom for microseconds.',
    ],
    specs: [
      [['Konu', 'Topic'], ['Lazer tayf ölçümü', 'Laser spectroscopy']],
      [['Sistem', 'System'], ['Antiprotonik helyum', 'Antiprotonic helium']],
      [['Ölçülen', 'Measures'], ['Antiproton kütlesi', 'Antiproton mass']],
    ],
  },
  {
    id: 'gbar', cat: 'exp', pos: [18, 31], h: 6.4, r: 3.4, view: 17,
    name: ['GBAR', 'GBAR'],
    short: ['Antimaddenin serbest düşüşü', 'Free fall of antimatter'],
    desc: [
      'GBAR önce bir antiproton ile iki pozitrondan oluşan pozitif antihidrojen iyonları üretmeyi hedefler. Yüklü oldukları için bu iyonlar mutlak sıfıra çok yakın sıcaklıklara soğutulabilir; ardından fazla pozitron lazerle koparılır ve nötr atom serbest düşüşe bırakılır.',
      'GBAR aims first to make positive antihydrogen ions, an antiproton with two positrons. Being charged, these ions can be cooled to temperatures very close to absolute zero; a laser then knocks off the extra positron and the neutral atom is left to fall freely.',
    ],
    fact: [
      'GBAR, ELENA’dan demet alan ilk deney oldu.',
      'GBAR was the first experiment to receive beam from ELENA.',
    ],
    specs: [
      [['Konu', 'Topic'], ['Yerçekimi', 'Gravity']],
      [['Yöntem', 'Method'], ['Serbest düşüş', 'Free fall']],
      [['Ara ürün', 'Intermediate'], ['Antihidrojen iyonu', 'Antihydrogen ion']],
    ],
  },
  {
    id: 'puma', cat: 'exp', pos: [17, 9], h: 4.8, r: 3.4, view: 17,
    name: ['PUMA', 'PUMA'],
    short: ['Taşınabilir antimadde tuzağı', 'A portable antimatter trap'],
    desc: [
      'PUMA, antiprotonları taşınabilir bir tuzağa doldurup kamyonetle CERN içindeki ISOLDE tesisine götürmek için tasarlandı. Orada antiprotonlar kısa ömürlü egzotik çekirdeklerle yok olur ve çekirdeğin yüzeyindeki proton–nötron dağılımı ortaya çıkar.',
      'PUMA is designed to load antiprotons into a transportable trap and drive them by van to the ISOLDE facility elsewhere at CERN. There the antiprotons annihilate with short-lived exotic nuclei, revealing how protons and neutrons are spread over the nuclear surface.',
    ],
    fact: [
      'Hedef, bir milyar kadar antiprotonu haftalarca saklayıp yolculuğa çıkarabilmektir.',
      'The aim is to store around a billion antiprotons for weeks and take them on the road.',
    ],
    specs: [
      [['Konu', 'Topic'], ['Egzotik çekirdekler', 'Exotic nuclei']],
      [['Varış', 'Destination'], ['ISOLDE', 'ISOLDE']],
      [['Özellik', 'Feature'], ['Taşınabilir', 'Transportable']],
    ],
  },
  {
    id: 'positron', cat: 'trap', pos: [62, 8], h: 4.6, r: 4.4, view: 18,
    name: ['Pozitron Kaynağı', 'Positron Source'],
    short: ['Antielektronlar radyoaktif tuzdan gelir', 'Antielectrons from a radioactive salt'],
    desc: [
      'Antihidrojen için antiprotonun yanına bir de pozitron (antielektron) gerekir. Bunlar hızlandırıcıdan değil, radyoaktif sodyum-22 kaynağından gelir. Pozitronlar donmuş neon tabakasında yavaşlatılır, sonra biriktirici tuzakta seyreltik gazla çarpışarak soğur ve toplanır.',
      'Antihydrogen needs a positron (antielectron) as well as an antiproton. These come not from the accelerator but from a radioactive sodium-22 source. The positrons are slowed in a layer of frozen neon, then cooled by collisions with dilute gas and collected in an accumulator trap.',
    ],
    fact: [
      'Aynı tür pozitronlar hastanelerdeki PET taramalarında da kullanılır.',
      'The same kind of positrons are used in hospital PET scans.',
    ],
    specs: [
      [['Kaynak', 'Source'], ['Sodyum-22', 'Sodium-22']],
      [['Yarı ömür', 'Half-life'], ['2,6 yıl', '2.6 years']],
      [['Yavaşlatıcı', 'Moderator'], ['Katı neon', 'Solid neon']],
    ],
  },
  {
    id: 'penning', cat: 'trap', pos: [62, 32], h: 4.8, r: 4.4, view: 18,
    name: ['Penning Tuzağı', 'Penning Trap'],
    short: ['Duvarlara dokunmadan saklamak', 'Storage without touching the walls'],
    desc: [
      'Antimadde herhangi bir maddeye dokunduğu anda yok olur; bu yüzden kap olarak alanlar kullanılır. Penning tuzağında güçlü bir manyetik alan antiprotonları eksen çevresinde tutar, halka elektrotların elektrik alanı da uçlardan kaçmalarını önler. İçerisi neredeyse kusursuz bir vakumdur.',
      'Antimatter annihilates the instant it touches matter, so fields are used as the container. In a Penning trap a strong magnetic field holds the antiprotons around the axis while the electric field of ring electrodes stops them escaping at the ends. Inside is an almost perfect vacuum.',
    ],
    fact: [
      'Tuzak yaklaşık −269 °C’ye soğutulur; içindeki vakum yıldızlararası uzaydakinden bile iyi olabilir.',
      'The trap is cooled to about −269 °C; its vacuum can be better than that of interstellar space.',
    ],
    specs: [
      [['Manyetik alan', 'Magnetic field'], ['Birkaç tesla', 'A few tesla']],
      [['Sıcaklık', 'Temperature'], ['≈ 4 K', '≈ 4 K']],
      [['Tutulan', 'Holds'], ['Yüklü parçacıklar', 'Charged particles']],
    ],
  },
  {
    id: 'mixing', cat: 'trap', pos: [62, 20], h: 4.2, r: 5.4, view: 20, lo: [-2.8, -3.6],
    name: ['Antihidrojen Tuzağı', 'Antihydrogen Trap'],
    short: ['Antiatomların doğduğu yer', 'Where anti-atoms are born'],
    desc: [
      'Soğuk antiproton ve pozitron bulutları burada nazikçe iç içe geçirilir; bir pozitron bir antiprotona bağlanınca antihidrojen atomu oluşur. Atom nötr olduğundan Penning tuzağından kaçar; onu sekiz kutuplu mıknatıs ve ayna bobinlerinden oluşan manyetik bir “çukur” tutar.',
      'Cold clouds of antiprotons and positrons are gently merged here; when a positron binds to an antiproton, an antihydrogen atom forms. Being neutral, the atom escapes the Penning trap; it is held instead by a magnetic “well” made by an octupole magnet and mirror coils.',
    ],
    fact: [
      'Manyetik tuzak yalnızca yarım kelvinden daha soğuk antiatomları tutabilir; çoğu kaçar.',
      'The magnetic trap can only hold anti-atoms colder than half a kelvin; most escape.',
    ],
    specs: [
      [['Ürün', 'Product'], ['Antihidrojen (H̄)', 'Antihydrogen (H̄)']],
      [['Tuzak derinliği', 'Trap depth'], ['≈ 0,5 K', '≈ 0.5 K']],
      [['Mıknatıslar', 'Magnets'], ['Oktupol + ayna bobinleri', 'Octupole + mirror coils']],
    ],
  },
  {
    id: 'detector', cat: 'trap', pos: [62, 20], h: 5.4, r: 3.6, view: 16, lo: [2.8, 1.2],
    name: ['Yok Olma Dedektörü', 'Annihilation Detector'],
    short: ['Antimaddeyi yok olurken görür', 'Sees antimatter as it vanishes'],
    desc: [
      'Antihidrojen doğrudan görülemez; varlığı yok oluşundan anlaşılır. Tuzak kapatılınca atomlar duvara çarpar ve antiproton yok olurken pion adlı parçacıklar saçılır. Tuzağı saran silikon katmanlar pionların izlerini kaydeder ve yok oluşun tam yerini hesaplar.',
      'Antihydrogen cannot be seen directly; its presence is revealed by its disappearance. When the trap is switched off the atoms hit the wall, and the annihilating antiproton sprays out particles called pions. Silicon layers around the trap record the pion tracks and reconstruct exactly where it happened.',
    ],
    fact: [
      'Bir gram antimadde üretmek, bugünkü hızla evrenin yaşından daha uzun sürerdi.',
      'At today’s rates, making one gram of antimatter would take longer than the age of the universe.',
    ],
    specs: [
      [['Tür', 'Type'], ['Silikon iz dedektörü', 'Silicon vertex detector']],
      [['Algılanan', 'Detects'], ['Yüklü pionlar', 'Charged pions']],
      [['Sonuç', 'Output'], ['Yok oluş konumu', 'Annihilation position']],
    ],
  },
];
