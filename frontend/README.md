# Chat-RealTime-Frontend
Frontend czatu RealTime z użyciem ReactJS.
Jest to zalążek mojej pracy nad projektem inżynierskim, którego celem jest stworzenie platformy do udzielania korepetycji z języków obcych.

W aplikacji na ten moment nowy użytkownik może się zarejestrować oraz zalogować. Może także rozpocząć czatowanie z innym użytkownikiem - 
na ten moment poprzez proste kliknięcie przycisku. Docelowo - poprzez zakup zajęć.

Po przejściu do strony czata, użytkownicy mogą ze sobą czatować tekstowo oraz także stworzyć wideo połączenie.
Możliwość włączenia/wyłączenia kamery, mikrofonu oraz udostępnienia ekranu. Komunikacja czatu tekstowego odbywa się z serwerem django z użyciem websocketów.
Komunikacja wideo połączeń odbywa się z użyciem biblioteki PeerJS z użyciem domyślnego serwera na chmurze dostarczonego poprzez właściciela biblioteki.
Docelowo - stworzenie swojego serwera do wideo połączeń. Całość frontendu napisana w ReactJS z użyciem różnych bibliotek.

Link do repozytorium z plikami backendu: https://github.com/Kstyk/Chat-RealTime-Backend

Kilka screenshotów:

![image](https://user-images.githubusercontent.com/80002380/233471175-a2938b54-6846-4ec8-8108-478fa5f88ef7.png)
![image](https://user-images.githubusercontent.com/80002380/233471365-1528a1a2-6d3b-44f8-843e-e56a5f52ab5b.png)
![image](https://user-images.githubusercontent.com/80002380/233471516-8a174240-27b4-4648-80c1-11cb1a2a8ad1.png)

Po kliknięciu przycisku Call u jednego z użytkowników, drugi może odpowiedzieć na połączenie
![image](https://user-images.githubusercontent.com/80002380/233471592-17e9356c-2067-4f47-bcc9-2f9588d06c2e.png)

Wideo połączenie odbywa się w tym samym pokoju co czat, jako okno Modal
![image](https://user-images.githubusercontent.com/80002380/233471968-cccbe073-beb7-49f7-bb48-3334e4daaf75.png)

Udostępnienie ekranu przez jednego z użytkowników
![image](https://user-images.githubusercontent.com/80002380/233472340-a9f6946e-bd46-4107-9763-eb9f21bc4e1a.png)
