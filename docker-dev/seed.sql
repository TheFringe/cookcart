-- Kör: podman exec -i postgres psql -U recipes -d recipes < docker-dev/seed.sql

INSERT INTO recipes (name, description, steps, servings, cook_time_minutes) VALUES
('Pasta Carbonara', 'Klassisk romersk pasta med ägg, pecorino och guanciale.', '["Koka pasta al dente","Stek guanciale krispigt","Blanda ägg och riven pecorino","Vänd ner pasta och stek, tillsätt äggblandningen off heat","Salta och peppra rikligt"]', 4, 25),
('Köttbullar med gräddsås', 'Svenska köttbullar med krämig gräddsås och lingonsylt.', '["Blanda köttfärs, ägg, lök och kryddor","Rulla till bollar","Stek i smör tills gyllenbruna","Gör gräddsåsen i stekpannan","Servera med potatismos och lingon"]', 4, 40),
('Kycklingwok med grönsaker', 'Snabb och smarrig wok med kyckling och säsongens grönsaker.', '["Skär kyckling i bitar","Hacka grönsaker","Hetta upp woken tills rykande het","Woka kyckling, tillsätt grönsaker","Smaksätt med soja och ingefära"]', 3, 20),
('Lax med dillsås', 'Ugnsbakad lax med klassisk svensk dillsås och kokt potatis.', '["Lägg laxen i ugnsform","Salta och peppra","Baka i 180°C i 15 min","Koka potatis","Blanda dillsås av gräddfil, dill och citron"]', 4, 30),
('Pannkakor', 'Tunna svenska pannkakor serverade med sylt och grädde.', '["Blanda mjöl och mjölk till slät smet","Tillsätt ägg och en nypa salt","Låt vila 30 min","Stek tunna pannkakor i smör","Servera med jordgubbssylt och vispgrädde"]', 4, 45),
('Tacos', 'Mexikanska tacos med kryddad köttfärs och tillbehör.', '["Stek köttfärs med lök","Tillsätt taco-kryddor och vatten","Låt puttra","Värm tortillabröd","Servera med salsa, guacamole, sallad och ost"]', 4, 30),
('Vegetarisk lasagne', 'Mustig lasagne med ricotta, spenat och tomatsås.', '["Stek lök och vitlök","Tillsätt krossade tomater och spenat","Blanda ricotta med ägg och parmesan","Varva sås, lasagneplattor och ricotta","Baka i 200°C i 40 min"]', 6, 80),
('Ceviche', 'Fräsch peruansk ceviche med vitfisk, lime och chili.', '["Skär fisk i bitar","Marinera i pressad lime 15 min","Tillsätt hackad chili och rödlök","Blanda med koriander","Servera direkt med majschips"]', 2, 20),
('Hummus', 'Hemgjord hummus på kikärtor med citron och tahini.', '["Koka kikärtor mjuka","Mixa med tahini, citronsaft och vitlök","Späd med olivolja och lite vatten","Smaksätt med salt och spiskummin","Garnera med paprikapulver och olivolja"]', 6, 15),
('Risotto ai funghi', 'Krämig svamprisotto med parmesan och vitt vin.', '["Stek schalottenlök i smör","Tillsätt arborio-ris och rosta","Häll i vitt vin under omrörning","Tillsätt varm buljong skopa för skopa","Rör i smör, parmesan och stekta svampar"]', 4, 35),
('Falafelbröd', 'Hemgjorda falafel i pitabröd med tahini och grönsaker.', '["Blötlägg kikärtor natten innan","Mixa med lök, koriander och kryddor","Forma bollar","Fritera i het olja","Servera i pitabröd med tahini, sallad och tomater"]', 4, 45),
('Tomatsoppa med basilika', 'Enkel och god tomatsoppa gjord på konserverade tomater.', '["Stek lök och vitlök i olivolja","Tillsätt krossade tomater och buljong","Låt puttra 20 min","Mixa slät med stavmixer","Smaksätt och servera med basilika och bröd"]', 4, 30),
('Biff Stroganoff', 'Klassisk rysk rätt med biff, svamp och grädde.', '["Skär biff i strimlor","Stek svamp och lök","Stek biffsremsor snabbt på hög värme","Blanda ihop med grädde och tomatpuré","Servera med pasta eller ris"]', 4, 35),
('Grekisk sallad', 'Fräsch sallad med tomat, gurka, fetaost och oliver.', '["Skär tomat och gurka i bitar","Dela oliver och rödlök","Smula fetaost över salladen","Ringla olivolja och lite vinäger","Strö oregano och smaksätt"]', 2, 10),
('Tikka Masala', 'Krämig indisk kycklingrätt i tomatsås med yoghurt.', '["Marinera kyckling i yoghurt och kryddor","Stek kycklingen","Tillsätt lök, ingefära och vitlök","Häll i krossade tomater och grädde","Låt puttra och servera med naan"]', 4, 50),
('Äggröra med lax', 'Len äggröra toppat med gravlax och gräslök.', '["Vispa ägg med lite mjölk","Stek i smör på låg värme under ständig omrörning","Ta av innan helt stelnat","Toppa med gravlax","Strö gräslök och servera på rostat bröd"]', 2, 10),
('Moussaka', 'Traditionell grekisk moussaka med aubergine och lammfärs.', '["Skiva och salta aubergine, låt rinna av","Stek aubergine i olja","Gör köttfärssås med lamm och tomater","Gör bechamelsås","Varva och baka i 180°C i 45 min"]', 6, 90),
('Sommarsoppa', 'Len svensk sommarsoppa med nylök, morötter och grädde.', '["Stek nylök i smör","Tillsätt tärnade morötter och potatis","Häll på hönsbuljong","Låt koka tills grönsakerna är mjuka","Tillsätt grädde och smaksätt med dill"]', 4, 30),
('Pulled Pork Bao', 'Ångade baobröd med slow-cooked pulled pork och picklade grönsaker.', '["Gnid in fläskköttet med kryddor","Baka i 120°C i 6 timmar","Dra isär köttet","Ångkoka baobröden","Fyll med kött, picklad gurka och sriracha-majonnäs"]', 4, 380),
('Chokladmousse', 'Luftig och rik chokladmousse på mörk choklad.', '["Smält mörk choklad i vattenbad","Vispa äggulor med socker tills vitt och pösigt","Vänd ner chokladen","Vispa grädde till mjuka toppar","Vänd försiktigt ihop och kyl 2 timmar"]', 6, 30);

-- ─── Ingredienser ─────────────────────────────────────────────────────────────

INSERT INTO ingredients (name, default_unit) VALUES
('pasta', 'g'),
('guanciale', 'g'),
('ägg', 'st'),
('pecorino', 'g'),
('nötfärs', 'g'),
('ströbröd', 'msk'),
('lök', 'st'),
('grädde', 'ml'),
('smör', 'g'),
('lingonsylt', 'g'),
('kycklingfilé', 'g'),
('paprika', 'st'),
('broccoli', 'g'),
('soja', 'msk'),
('ingefära', 'cm'),
('vitlök', 'klyfta'),
('sesamolja', 'msk'),
('lax', 'g'),
('potatis', 'g'),
('gräddfil', 'ml'),
('dill', 'g'),
('citron', 'st'),
('mjöl', 'g'),
('mjölk', 'ml'),
('jordgubbssylt', 'g'),
('vispgrädde', 'ml'),
('köttfärs', 'g'),
('tacokryddor', 'g'),
('tortillabröd', 'st'),
('sallad', 'g'),
('tomat', 'st'),
('ost', 'g'),
('salsa', 'g'),
('lasagneplattor', 'g'),
('ricotta', 'g'),
('spenat', 'g'),
('krossade tomater', 'g'),
('parmesan', 'g'),
('vitfisk', 'g'),
('lime', 'st'),
('chili', 'st'),
('rödlök', 'st'),
('koriander', 'g'),
('majschips', 'g'),
('kikärtor', 'g'),
('tahini', 'msk'),
('olivolja', 'msk'),
('spiskummin', 'tsk'),
('arborio-ris', 'g'),
('vitt vin', 'ml'),
('schalottenlök', 'st'),
('svamp', 'g'),
('hönsbuljong', 'ml'),
('grönsaksbuljong', 'ml'),
('pitabröd', 'st'),
('basilika', 'g'),
('tomatpuré', 'msk'),
('biff', 'g'),
('fetaost', 'g'),
('oliver', 'g'),
('rödvinsvinäger', 'msk'),
('oregano', 'tsk'),
('yoghurt', 'ml'),
('tikka masala-kryddor', 'msk'),
('naan', 'st'),
('gravlax', 'g'),
('gräslök', 'g'),
('bröd', 'skiva'),
('aubergine', 'st'),
('lammfärs', 'g'),
('nylök', 'knippe'),
('morötter', 'st'),
('fläskkött', 'g'),
('baobröd', 'st'),
('picklad gurka', 'g'),
('sriracha', 'msk'),
('majonnäs', 'ml'),
('mörk choklad', 'g'),
('socker', 'g');

-- ─── Recept–ingredienskopplingar ───────────────────────────────────────────────

-- Pasta Carbonara
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Pasta Carbonara'), (SELECT id FROM ingredients WHERE name = 'pasta'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Pasta Carbonara'), (SELECT id FROM ingredients WHERE name = 'guanciale'), 150, 'g'),
((SELECT id FROM recipes WHERE name = 'Pasta Carbonara'), (SELECT id FROM ingredients WHERE name = 'ägg'), 4, 'st'),
((SELECT id FROM recipes WHERE name = 'Pasta Carbonara'), (SELECT id FROM ingredients WHERE name = 'pecorino'), 80, 'g');

-- Köttbullar med gräddsås
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'nötfärs'), 500, 'g'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'ägg'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'ströbröd'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'grädde'), 300, 'ml'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'smör'), 50, 'g'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'lingonsylt'), 100, 'g'),
((SELECT id FROM recipes WHERE name = 'Köttbullar med gräddsås'), (SELECT id FROM ingredients WHERE name = 'potatis'), 800, 'g');

-- Kycklingwok med grönsaker
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'kycklingfilé'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'paprika'), 2, 'st'),
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'broccoli'), 300, 'g'),
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'soja'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'ingefära'), 2, 'cm'),
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 3, 'klyfta'),
((SELECT id FROM recipes WHERE name = 'Kycklingwok med grönsaker'), (SELECT id FROM ingredients WHERE name = 'sesamolja'), 1, 'msk');

-- Lax med dillsås
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Lax med dillsås'), (SELECT id FROM ingredients WHERE name = 'lax'), 600, 'g'),
((SELECT id FROM recipes WHERE name = 'Lax med dillsås'), (SELECT id FROM ingredients WHERE name = 'potatis'), 800, 'g'),
((SELECT id FROM recipes WHERE name = 'Lax med dillsås'), (SELECT id FROM ingredients WHERE name = 'gräddfil'), 200, 'ml'),
((SELECT id FROM recipes WHERE name = 'Lax med dillsås'), (SELECT id FROM ingredients WHERE name = 'dill'), 20, 'g'),
((SELECT id FROM recipes WHERE name = 'Lax med dillsås'), (SELECT id FROM ingredients WHERE name = 'citron'), 1, 'st');

-- Pannkakor
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Pannkakor'), (SELECT id FROM ingredients WHERE name = 'mjöl'), 300, 'g'),
((SELECT id FROM recipes WHERE name = 'Pannkakor'), (SELECT id FROM ingredients WHERE name = 'mjölk'), 600, 'ml'),
((SELECT id FROM recipes WHERE name = 'Pannkakor'), (SELECT id FROM ingredients WHERE name = 'ägg'), 3, 'st'),
((SELECT id FROM recipes WHERE name = 'Pannkakor'), (SELECT id FROM ingredients WHERE name = 'smör'), 50, 'g'),
((SELECT id FROM recipes WHERE name = 'Pannkakor'), (SELECT id FROM ingredients WHERE name = 'jordgubbssylt'), 200, 'g'),
((SELECT id FROM recipes WHERE name = 'Pannkakor'), (SELECT id FROM ingredients WHERE name = 'vispgrädde'), 200, 'ml');

-- Tacos
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'köttfärs'), 500, 'g'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'tacokryddor'), 30, 'g'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'tortillabröd'), 8, 'st'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'sallad'), 100, 'g'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'tomat'), 3, 'st'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'ost'), 150, 'g'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'gräddfil'), 200, 'ml'),
((SELECT id FROM recipes WHERE name = 'Tacos'), (SELECT id FROM ingredients WHERE name = 'salsa'), 200, 'g');

-- Vegetarisk lasagne
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'lasagneplattor'), 250, 'g'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'ricotta'), 500, 'g'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'spenat'), 300, 'g'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'krossade tomater'), 800, 'g'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'parmesan'), 100, 'g'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'ägg'), 2, 'st'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Vegetarisk lasagne'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 3, 'klyfta');

-- Ceviche
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Ceviche'), (SELECT id FROM ingredients WHERE name = 'vitfisk'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Ceviche'), (SELECT id FROM ingredients WHERE name = 'lime'), 6, 'st'),
((SELECT id FROM recipes WHERE name = 'Ceviche'), (SELECT id FROM ingredients WHERE name = 'chili'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Ceviche'), (SELECT id FROM ingredients WHERE name = 'rödlök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Ceviche'), (SELECT id FROM ingredients WHERE name = 'koriander'), 15, 'g'),
((SELECT id FROM recipes WHERE name = 'Ceviche'), (SELECT id FROM ingredients WHERE name = 'majschips'), 100, 'g');

-- Hummus
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Hummus'), (SELECT id FROM ingredients WHERE name = 'kikärtor'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Hummus'), (SELECT id FROM ingredients WHERE name = 'tahini'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Hummus'), (SELECT id FROM ingredients WHERE name = 'citron'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Hummus'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 2, 'klyfta'),
((SELECT id FROM recipes WHERE name = 'Hummus'), (SELECT id FROM ingredients WHERE name = 'olivolja'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Hummus'), (SELECT id FROM ingredients WHERE name = 'spiskummin'), 1, 'tsk');

-- Risotto ai funghi
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'arborio-ris'), 300, 'g'),
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'svamp'), 300, 'g'),
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'vitt vin'), 100, 'ml'),
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'schalottenlök'), 2, 'st'),
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'parmesan'), 80, 'g'),
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'smör'), 60, 'g'),
((SELECT id FROM recipes WHERE name = 'Risotto ai funghi'), (SELECT id FROM ingredients WHERE name = 'grönsaksbuljong'), 1000, 'ml');

-- Falafelbröd
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'kikärtor'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'koriander'), 15, 'g'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 2, 'klyfta'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'pitabröd'), 4, 'st'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'tahini'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'sallad'), 80, 'g'),
((SELECT id FROM recipes WHERE name = 'Falafelbröd'), (SELECT id FROM ingredients WHERE name = 'tomat'), 2, 'st');

-- Tomatsoppa med basilika
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Tomatsoppa med basilika'), (SELECT id FROM ingredients WHERE name = 'krossade tomater'), 800, 'g'),
((SELECT id FROM recipes WHERE name = 'Tomatsoppa med basilika'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Tomatsoppa med basilika'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 3, 'klyfta'),
((SELECT id FROM recipes WHERE name = 'Tomatsoppa med basilika'), (SELECT id FROM ingredients WHERE name = 'olivolja'), 2, 'msk'),
((SELECT id FROM recipes WHERE name = 'Tomatsoppa med basilika'), (SELECT id FROM ingredients WHERE name = 'grönsaksbuljong'), 500, 'ml'),
((SELECT id FROM recipes WHERE name = 'Tomatsoppa med basilika'), (SELECT id FROM ingredients WHERE name = 'basilika'), 15, 'g');

-- Biff Stroganoff
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'biff'), 500, 'g'),
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'svamp'), 300, 'g'),
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'grädde'), 200, 'ml'),
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'tomatpuré'), 2, 'msk'),
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'smör'), 30, 'g'),
((SELECT id FROM recipes WHERE name = 'Biff Stroganoff'), (SELECT id FROM ingredients WHERE name = 'pasta'), 300, 'g');

-- Grekisk sallad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'tomat'), 4, 'st'),
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'fetaost'), 200, 'g'),
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'oliver'), 100, 'g'),
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'rödlök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'olivolja'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'rödvinsvinäger'), 1, 'msk'),
((SELECT id FROM recipes WHERE name = 'Grekisk sallad'), (SELECT id FROM ingredients WHERE name = 'oregano'), 1, 'tsk');

-- Tikka Masala
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'kycklingfilé'), 600, 'g'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'yoghurt'), 200, 'ml'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'krossade tomater'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'grädde'), 100, 'ml'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'ingefära'), 2, 'cm'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 3, 'klyfta'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'tikka masala-kryddor'), 3, 'msk'),
((SELECT id FROM recipes WHERE name = 'Tikka Masala'), (SELECT id FROM ingredients WHERE name = 'naan'), 4, 'st');

-- Äggröra med lax
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Äggröra med lax'), (SELECT id FROM ingredients WHERE name = 'ägg'), 4, 'st'),
((SELECT id FROM recipes WHERE name = 'Äggröra med lax'), (SELECT id FROM ingredients WHERE name = 'gravlax'), 100, 'g'),
((SELECT id FROM recipes WHERE name = 'Äggröra med lax'), (SELECT id FROM ingredients WHERE name = 'mjölk'), 30, 'ml'),
((SELECT id FROM recipes WHERE name = 'Äggröra med lax'), (SELECT id FROM ingredients WHERE name = 'smör'), 20, 'g'),
((SELECT id FROM recipes WHERE name = 'Äggröra med lax'), (SELECT id FROM ingredients WHERE name = 'gräslök'), 10, 'g'),
((SELECT id FROM recipes WHERE name = 'Äggröra med lax'), (SELECT id FROM ingredients WHERE name = 'bröd'), 4, 'skiva');

-- Moussaka
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'aubergine'), 2, 'st'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'lammfärs'), 500, 'g'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'krossade tomater'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'lök'), 1, 'st'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'vitlök'), 3, 'klyfta'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'mjölk'), 500, 'ml'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'mjöl'), 50, 'g'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'smör'), 50, 'g'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'parmesan'), 80, 'g'),
((SELECT id FROM recipes WHERE name = 'Moussaka'), (SELECT id FROM ingredients WHERE name = 'ägg'), 2, 'st');

-- Sommarsoppa
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'nylök'), 1, 'knippe'),
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'morötter'), 3, 'st'),
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'potatis'), 400, 'g'),
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'hönsbuljong'), 1000, 'ml'),
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'grädde'), 200, 'ml'),
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'smör'), 30, 'g'),
((SELECT id FROM recipes WHERE name = 'Sommarsoppa'), (SELECT id FROM ingredients WHERE name = 'dill'), 15, 'g');

-- Pulled Pork Bao
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Pulled Pork Bao'), (SELECT id FROM ingredients WHERE name = 'fläskkött'), 1000, 'g'),
((SELECT id FROM recipes WHERE name = 'Pulled Pork Bao'), (SELECT id FROM ingredients WHERE name = 'baobröd'), 8, 'st'),
((SELECT id FROM recipes WHERE name = 'Pulled Pork Bao'), (SELECT id FROM ingredients WHERE name = 'picklad gurka'), 100, 'g'),
((SELECT id FROM recipes WHERE name = 'Pulled Pork Bao'), (SELECT id FROM ingredients WHERE name = 'sriracha'), 2, 'msk'),
((SELECT id FROM recipes WHERE name = 'Pulled Pork Bao'), (SELECT id FROM ingredients WHERE name = 'majonnäs'), 100, 'ml');

-- Chokladmousse
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM recipes WHERE name = 'Chokladmousse'), (SELECT id FROM ingredients WHERE name = 'mörk choklad'), 200, 'g'),
((SELECT id FROM recipes WHERE name = 'Chokladmousse'), (SELECT id FROM ingredients WHERE name = 'ägg'), 4, 'st'),
((SELECT id FROM recipes WHERE name = 'Chokladmousse'), (SELECT id FROM ingredients WHERE name = 'socker'), 50, 'g'),
((SELECT id FROM recipes WHERE name = 'Chokladmousse'), (SELECT id FROM ingredients WHERE name = 'vispgrädde'), 200, 'ml');

-- ─── Inköpslistor ──────────────────────────────────────────────────────────────

INSERT INTO shopping_lists (name) VALUES ('ICA'), ('Willys');

-- ICA
INSERT INTO shopping_list_items (list_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'kycklingfilé'),    800,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'lax'),            400,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'pasta'),          500,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'ägg'),             12,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'mjölk'),         1000,  'ml'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'smör'),           200,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'grädde'),         400,  'ml'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'parmesan'),       100,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'olivolja'),         5,  'msk'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'citron'),           3,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'tomat'),            6,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'lök'),              3,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'vitlök'),           4,  'klyfta'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'potatis'),        1000,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'morötter'),         4,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'spenat'),          200,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'krossade tomater'), 800, 'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'basilika'),         20,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'yoghurt'),         400,  'ml'),
((SELECT id FROM shopping_lists WHERE name = 'ICA'), (SELECT id FROM ingredients WHERE name = 'broccoli'),        400,  'g');

-- Willys
INSERT INTO shopping_list_items (list_id, ingredient_id, quantity, unit) VALUES
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'köttfärs'),        500,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'pasta'),          1000,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'krossade tomater'), 1600, 'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'ägg'),               6,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'mjölk'),          2000,  'ml'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'smör'),            250,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'potatis'),        1500,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'lök'),               4,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'vitlök'),            2,  'klyfta'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'morötter'),          6,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'grädde'),          200,  'ml'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'gräddfil'),        200,  'ml'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'ost'),             300,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'tomat'),             4,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'sallad'),           150,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'kycklingfilé'),    600,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'tacokryddor'),      60,  'g'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'tortillabröd'),      8,  'st'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'soja'),              4,  'msk'),
((SELECT id FROM shopping_lists WHERE name = 'Willys'), (SELECT id FROM ingredients WHERE name = 'bröd'),              8,  'skiva');
