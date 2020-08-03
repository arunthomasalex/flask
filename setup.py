from setuptools import setup

setup(
    name = 'run',
    version = 0.1,
    packages=['testcases'],
    py_modules= ['run'],
    include_package_data=True,
    install_requires=[
        'Click',
    ],
    entry_points='''
    [console_scripts]
    run=run:run_command
    '''
)