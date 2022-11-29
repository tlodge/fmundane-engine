Receipt printer (Pipsta) driver
-------------------------------

Looks like support is no longer available, but got working on the pi with details from the following:

https://www.raspberrypi.org/forums/viewtopic.php?p=1736425

```
$ sudo apt-get update
$ sudo dpkg -i libboost-program-options1.49.0_1.49.0-2ubuntu1_armhf.deb 
$ sudo dpkg -i pipsta-printer-utilities-1.1.1-Linux.deb 
$ sudo apt-get -f install
$ fpu --version
$ sudo dpkg -i pipsta-cups-driver-0.3.0-armhf.deb 
$ sudo apt-get -f install
$ sudo dpkg -i libtiff4-fake_1.0_all.deb 
$ sudo dpkg -i pipsta-cups-driver-0.3.0-armhf.deb 
$ sudo apt-get -f install
$ sudo dpkg -i libtiff4-fake_1.0_all.deb 
$ sudo dpkg -i pipsta-cups-driver-0.3.0-armhf.deb 
$ lp ~/.profile
$ sudo apt-get install libusb-dev
pyusb-1.1.0$ sudo python2 setup.py install
pyusb-1.1.0$ sudo python3 setup.py install
bitarray-1.5.3 $ sudo python2 setup.py install
bitarray-1.5.3 $ sudo python3 setup.py install
$ sudo apt-get install libjpeg8
$ sudo apt-get install libjpeg8-dev
$ sudo dpkg -i pipsta-0.3.0-armhf.deb 
$ sudo apt-get -f install
$ sudo cp -r /usr/share/pipsta ~
```