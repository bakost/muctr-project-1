#!/bin/bash
FILE=/home/andrey/students_muctr_bot/temp.file
cd /home/andrey/students_muctr_bot/

echo "Start script..."
echo ""
sleep 1
screen -dmS bot_temp
runuser -l root -c "screen -S bot_temp -X screen /home/andrey/students_muctr_bot/bot_temp.sh"
echo "Script start complete!"
echo ""
while :
do
	while [ -f "$FILE" ];
	do
		runuser -l root -c 'screen -X -S bot_temp quit'
		sleep 1
		rm -r /home/andrey/students_muctr_bot/__pycache__
		rm -r /home/andrey/students_muctr_bot/temp.file
		echo "Restart script..."
		echo ""
		screen -dmS bot_temp
		runuser -l root -c "screen -S bot_temp -X screen /home/andrey/students_muctr_bot/bot_temp.sh"
	done	
done