# IIS Projekt

### Softwarové prerekvizity:
1. https://laravel.com/docs/12.x/installation
2. https://nodejs.org/en (často se na instalaci používá tenhle nástroj https://github.com/nvm-sh/nvm)
3. https://docs.docker.com/engine/install/

Docker se hodí protože chtějí ať používámě nějakou klasickou databazi (ne sqlite), tím pádem docker zajišťuje menší otravu se setupem. \
Automaticky se pustí se dva kontejnery kde jeden je PHP backend co tvoří odpovědi na requesty a druhý je MySQL databáze. \
Tohle se bude hodit až pak budeme muset projekt deploynout někam na internet aby se na to dostali.

### Jak to zprovoznit:

Po klonování repositáře z githubu se musí nainstalovat potřebné balíčky: `composer setup` \
Toto stáhne potřebné PHP balíčky (backend) a i NodeJS balíčky (frontend).

> Spuštění probíhá s pomocným wrapperem kolem docker příkazů. \
> https://laravel.com/docs/12.x/sail#configuring-a-shell-alias \
> `./vendor/bin/sail up` pustí oba kontejnery s PHP backendem a MySQL databází (při prvním spuštění to trvá chvilku než to vytvoří custom docker kontejnery)

V dokumentaci doporučují tento alias aby člověk nemusel furt psát `./vendor/bin/sail`:

> `alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'`

Při prvním spuštění to možná hodí že to nemůže najít nějakou tabulku z databáze, tyto commandy mně pomohly:

> `sail artisan session:table` \
> `sail artisan migrate`

Při práci na frontendu je důležité si ještě pustit command:

> `sail npm run dev`

Jinak by se frontend při úpravách neaktualizoval, u PHP kódu backendu toto není problém protože se pouští při každém requestu takže tam se po uložených úpravách nový kód začne automaticky využívat i za běhu serveru.

Ale frontend který se odesílá uživateli se bere ze složky `./public/build`, aby odsud byla přístupná nová verze tak se musí celá složka aktualizovat pomocí `sail npm run build`.

Tohle je ale otrava dělat při každé změně takže `sail npm run dev` zajistí to aby se frontend automaticky aktualizoval (uživateli se pak odesílá zkompilovaná verze frontendu z paměti), když si toto zapomeneš pustit tak uvidíš neaktualizovanou verzi frontendu ze složky `./public/build`, pokud to teda nebuildneš ručně což je otrava furt dokola dělat.

Hlavní kód backendu je ve složce `./app`, a frontendu v `./resources/js` (tady jsou právě nezkompilovaný soubory který využívají všechny možné knihovny a tomu prohlížeč sám o sobě nerozumí, takže se to pak kompiluje do šložky `./public/build`, dev server to překládá automaticky při změně a odesílá z paměti)

Těch souborů je hromada a je to hezky popsané tady: \
https://laravel.com/docs/12.x/structure

Ta dokumentace je celkově dobrá, je tam odpověď skoro na všechno a je tam i docela dobrý search.

Ještě další knihovny které jsou součástí laravelu:

https://react.dev/ (frontend UI knihovna) (`./resources/js`) \
https://inertiajs.com/ (umožňuje PHP backendu jednoduše vykreslovat UI v reactu a předávat mu data na zobrazení)\
https://tailwindcss.com/docs/styling-with-utility-classes  (styly které jdou psát rovnou do UI aby jsme se nemuseli obtěžovat s CSS soubory)

Diagramy databáze a use case (přihlášení se školním účtem) (ukradl jsem z IUSu):
https://drive.google.com/drive/u/1/folders/1dUneJ2N_rKONvqNk1jdmgD-DESkVbOQX

Bude nejlepší když si nejprve uděláme ty diagramy, pak můžeme udělat tu PHP logiku a nakonec to zobrazit ve frontendu, přece jenom i takovýto postup doporučují i v zadání.

Kdyby cokoliv tak napiš
