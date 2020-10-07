from requests import post
from shutil import copy
from datetime import datetime 
from ConfigParser import SafeConfigParser
import os
import click
import xml.etree.ElementTree as ET

def extract(xml_file_path, suite):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    stats = ( (stat.attrib['pass'], stat.attrib['fail']) for stat in root.iter('stat') if stat.text == suite )
    for msg in root.iter('msg'):
        date = msg.attrib['timestamp']
        break
    return date, stats

def extract_stat(config):
    datas = {}
    try:
        type, suite = config['type'], config['suite']
        files = iter(os.listdir('./reports'))
        date, stats = extract(config['xml_location'], suite)
        while True:
            for data in stats:
                datas['type'] = type
                datas['suite'] = suite
                datas['passed'] = data[0]
                datas['failed'] = data[1]
                datas['dated'] = date
                print(config['api_url'])
                post(config['api_url'], datas)
                print(datas)
            file_name = next(files)
            file = "reports/{}".format(file_name)
            names =  file_name.split('-')
            suite, type = names[1], names[2].split('(')[0]
            date, stats = extract(file, suite)
            os.remove(file)
    except StopIteration:
        print "Uploaded all the datas."
    except:
        try:
            os.makedirs("reports")
        except OSError:
            pass
        index = 0
        new_file = "reports/{}-{}-{}({}).xml".format(datetime.today().strftime('%Y%m%d'), config['suite'], config['type'], index)
        copy_flag = True
        try:
            while True:
                date, stats = extract(new_file, config['suite'])
                for data in stats:
                    if data[0] == datas['passed'] and data[1] == datas['failed'] and date == datas['dated']:
                        copy_flag = False
                new_file = "reports/{}-{}-{}({}).xml".format(datetime.today().strftime('%Y%m%d'), config['suite'], config['type'], index)
                index = index + 1
        except:
            pass
        if copy_flag:
            print "Copying file to retry later."
            copy(config['xml_location'], new_file)

@click.command()
@click.option('--env', default='dev', help='Specify an environment specified in config.ini.', show_default=True)
@click.option('--suite', default=None, help='Specify the type of testcases to be extracted.')
@click.option('--type', default='ui', help='Specify the type(ui/headless).')
@click.option('--path', default=None, help='Specify the file location.')
def extractor(env, suite, type, path):
    config = SafeConfigParser()
    config.read('config.ini')
    configurations = { prop[0]: prop[1] for prop in config.items(env)}
    if suite is not None:
        configurations['suite'] = suite 
    if path is not None:
        configurations['xml_location'] = path
    configurations['type'] = type
    extract_stat(configurations)

if __name__ == "__main__":
    config = SafeConfigParser()
    config.read('config.ini')
    extract_stat({ prop[0]: prop[1] for prop in config.items('dev')})